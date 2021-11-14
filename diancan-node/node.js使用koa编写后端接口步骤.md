

## 																一.初始化项目 

##### 			新建项目->创建app.js文件

```
npm init				//生成package.json(全部回车即可)
npm install nodemon  	//安装nodemon修改代码后自动重启项目
npm install koa			//安装koa
npm install koa-json    //把响应数据转成json格式
npm install koa-router  //koa路由
npm install koa-bodyparser //在ctx获取发起请求传入的参数
npm install mongoose	//安装mongoose连接数据库
npm install koa-cors    //解决跨域
```

##### 				创建config文件夹->创建处理未知的错误globalerr.js文件

```
// 自定义异常处理中间件
	class Err extends Error{  	//Error是node自带的类
		constructor(msg,code) {
	   	 super()
			this.msg = msg
			this.code = code
		}
	}

 let globalerr = async(ctx,next)=>{
	 try{
	 	await next()		//所有的中间件都会走一次这里
	 }catch(err){
		 const finderr = err instanceof Err //A instanceof B ，返回值为boolean类型，用来判断A是否是B的实例对象或者B子类的实例对象。如果是则返回true,否则返回false。
		 if(finderr){	//node中Error类中包含的已知类型的错误
			 ctx.body = {
				 msg:err.msg
			 }
			 ctx.status = err.code
		 }
		 else{
			 if(err.field){ //自定义的错误
				 ctx.body = {
				 	 msg:'图片参数不正确'
				 }
				 ctx.status = 400
				 return false
			 }
			 //未知类型的错误
			 ctx.body = {
			 	 msg:'Err未知错误'
			 }
			 ctx.status = 500
		 }
	 }
 }
 module.exports = globalerr
```



## 						二.基础配置+连接数据库+启动node.js服务器（app.js中写入）

```
const Koa = require('koa'); //引入koa
const app = new Koa();		//实例化koa
app.listen(3000); //服务启动端口 不能和其他应用端口冲突

// 处理全局异常错误
const globalerr = require('./config/abnormal.js')// 全局异常处理
app.use(globalerr)  //注册处理全局异常处理中间件

//项目的基础配置
const cors = require('koa-cors');// 解决跨域
const json = require('koa-json');//把响应数据转成json格式
const bodyParser = require('koa-bodyparser'); //获取发起请求传入的参数
app.use(cors());
app.use(json());
app.use(bodyParser());

// 连接数据库
const mongoose = require('mongoose')  //引入mongoose
mongoose.connect('数据库公网地址', {
  useNewUrlParser: true,// 因为mongoose放弃使用一些指令，导致会出现警告
  useUnifiedTopology: true
}).then((res)=>{
	console.log('数据库连接成功')
})
.catch((err)=>{
	console.log('数据库连接失败',err)
})
mongoose.set('useFindAndModify', false)// 解决对数据库增删改查出现的警告


//配置路由
const router = require('koa-router')() //后面加()直接实例化路由
***********************************************************************************************************
*	...这只是一个接口，	多个接口按👇步骤三+四注册再引入+注册路油中间件使用即可										  *
*	const adduser= require('./routes/adduser') // 引入注册登录的路由										    *
*	router.use('/api',adduser) // 注册路由中间件 配置注册登录的接口											    *
*	调用此接口获取数据的请求地址为: http://localhost:3000/api/adduser(服务器地址+/路由中间件的地址+/注册路由接口的地址) *
* 	.......														                                          *
*	.......																								  *
***********************************************************************************************************
app.use(router.routes())  //注册所有的路由中间件
app.use(router.allowedMethods()) //允许路由方法

console.log('服务器启动成功')
```

## 					三.设计数据库名称+设置储存字段要求，注册对象模型（写路由接口）

#### 			1.新建models文件夹（存放所有的Schema字段）

##### 			2.新建Username.js文件（每个数据库字段和对象模型对应一个js文件）

```
const mongoose = require('mongoose') //引入mongoose
const Schema = mongoose.Schema

// 实例化数据模板:注册功能字段
const NameSchema = new Schema(
	{
		// 注册对象模型
		name:{
			type:String,
			require:true
		},
		password:{
			type:String,
			require:true
		},
		openid:{           //商家的唯一标识
			type:String,
			require:true
		}
	},
	{
		versionKey:false  //取消数据库自动生成的	"_V"=0 字段
	}
)
module.exports = Username = mongoose.model('mongodb数据库名称',NameSchema)

```

## 											四.创建路由请求接口

#### 1.在config文件夹（分离抽取模块的文件夹）

##### 	创建respond.js文件（里面写好响应类）

```
class respond{
	constructor(ctx,msg='SUCCESS',data=[],code=200) { //给了默认值
	    this.ctx = ctx
		this.msg = msg
		this.data = data
		this.code = code
	} 
	// 参数正确的响应方法
	suctip(){
		this.ctx.body = {   //给予提示(默认给了SUCCESS)+数据(需要返回数据可传值替换默认的[])+状态码(默认给了200)
			msg:this.msg,
			data:this.data
		}
		this.ctx.status = this.code
	}
	// 参数出错的响应方法  
	errtip(tipmsg,codes){
		this.ctx.body = {  //只给提示+状态码
			msg:tipmsg
		}
		this.ctx.status = codes
	}
}
module.exports = initdata
```

#### 2.新建router文件夹（存放所有的路由接口）

##### 		       新建adduser.js文件（里面写好注册接口路由）

```
const router = require('koa-router')()// 路由:()直接实例化
const Username = require('../../models/username') // 引入Schema注册模型
const respond = require('../../config/respond.js') //处理响应的respond.js文件

//注册接口路由
router.post('/adduser',async ctx=>{
	let{name,password,userid} = ctx.request.body  //解构出用户信息
	//往数据库添加数据前 应该先做校验
	//参数出错的响应
	if(name == ''){
		new respond(ctx).errtip('参数不能为空',202)
		return false  //如果出错就停止执行代码 不再继续向下执行
	}
	...更具具体情况给出不同的响应
	//给数据库添加数据
	const user = new Username({			
		name,
		password,
		userid 
	})
	//参数正确的响应
	await user.save()
	.then((res)=>{  //往数据库中添加数据成功
		new initdata(ctx,'注册成功').suctip()
	)})
	.catch((err)=>{
		new initdata(ctx).errtip('注册失败',500)
	})
})
module.exports = router.routes()

```























