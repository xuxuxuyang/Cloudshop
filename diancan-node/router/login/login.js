// -----------------------------注册-登录-接口----------------------
const router = require('koa-router')()//实例化new路由
const result = require('../../config/result.js')// 引入统一给前端返回的body响应
const {getToken,Addurl,Tripurl} = require('../../config/databaseapi.js')// 操作数据库的接口
const {regcheck} = require('../../config/checking.js')// 校验
const {gentoken} = require('../../token/jwt.js')// 生成token

// 注册接口
router.post('/register', async ctx=>{
	let {account,password} = ctx.request.body // post提交的值在：ctx.request.body
	new regcheck(ctx,account,password).start()// 1:多个校验调用子类方法:子类方法调用父类多个方法 一步到位
	const query = `db.collection('business-acc').where({account:'${account}'}).get()`	// 2.查询手机号码之前是否已经注册过
	try{
		const user = await new getToken().posteve(Tripurl,query) //查询数据 
		if(user.data.length > 0){   // 已经注册过
			new result(ctx,'此手机号已注册',202).answer()
		}else{//data返回空数组[]  没有注册过
			const uid = new Date().getTime()// 生成商家唯一标识uid1630929117237
			const struid = JSON.stringify(uid)
			const OBJ = {account,password,uid:struid} //用户的注册资料信息
			const STR = JSON.stringify(OBJ)
			const addquery = `db.collection('business-acc').add({data:${STR}})` 
			await new getToken().posteve(Addurl,addquery)//增加数据
			new result(ctx,'注册成功').answer()
		}
	}catch(e){
		new result(ctx,'注册失败,服务器发生错误',500).answer()
	}
})
// 登录接口
router.post('/login', async ctx=>{
	let {account,password} = ctx.request.body // post提交的值在：ctx.request.body
	const query = `db.collection('business-acc').where({account:'${account}',password:'${password}'}).get()`
	try{
		const user = await new getToken().posteve(Tripurl,query)//查询数据
		if(user.data.length == 0){  //没有查询到
			new result(ctx,'账号或密码错误',202).answer()
		}else{ 
			const OBJ = JSON.parse(user.data[0])
			new result(ctx,'登录成功',200,{token:gentoken(OBJ.uid)}).answer()  //登录成功 返回token给前端
		}
	}catch(e){
		new result(ctx,'登录失败,服务器发生错误',500).answer()
	}
})

module.exports = router.routes()