## nodejs中的导出自定义模块  module.exports = 方法名 或 {}

```
function men(data){
	console.log('导出'+ data)
}

module.exports = men 
module.exports = {
	men  //ea6简写
}
```

## nodejs中的导入自定义模块   require('../../文件名')

```
const men = require('../men.js')  // 自己命名导入的模块

console.log( men(123))
console.log( men.men(123))  //导入的是对象
```



## node自带模块（fs/qs/http/url....等）

##### fs模块:文件系统  	fs.readfile()读取文件  fs.writeFile()写入文件

##### path模块：路径 	path.resolve()方法：将路径或路径片段序列解析为绝对路径

##### __dirname是全局对象，获取当前文件夹的位置

```
const fs = require('fs')
const path = require('path')
const pathurl = path.resolve(__dirname,'文件名')  
//异步方法 同步为readFileSync
fs.readFile('../文件名'，'utf8',(err,data)=>{
		if(err) throw err;
		console.log(data)
})
//异步方法 同步为writeFileSync
fs.writeFile('../文件名'，'写入的内容',(err,data)=>{	
		if(err) throw err;
		console.log('文件已写入完成')
})
```



#### qs模块:  querystring 查询字符串

```
const qs = require('querystring')

//querystring.stringify() 方法通过遍历对象的"自有属性"从给定的 obj 生成网址查询字符串
const param = qs.stringdfly({  
	'appid':'123',
	'secret':'abc',
	'code':'1203'
	...
})
cosnt url = 'https://api.qq.com/xy?' + param

console.log(url)  //输出：'https://api.qq.com/xy?appid=123&&secret=abc&&code=1203
```



## node第三方模块 request/...等（npm下载...）

```
npm install request  //安装request模块

const request = require('request');
function http() {
    request('http://api.cn/shopdata',function(error,response,body){
    	console.log(body)  //输出获取到的数据
    })
}
```



## node和Vue中定义函数的不同

```
node中定义函数要使用 function前缀
function sum(){}
```



## async await 异步编程同步化

```
  methods：{
  	list(){
  		return new Promise((resolve,reject)=>{
  			uni.request({
  				url:'http://api.cn/shopdata',
  				methods:'GET',
  				success:()=>{
  					resolve(res)
  				}
  			})
  		})
  	}
  	//异步async方法
  	async getinfo(){
  		try{
  			let shopdata = await this.list()  //await等待的函数一定要返回promise 返回reslove()的值
  			console.log('shopdata')			//如果await等待的函数执行出现错误，下面的代码会停止运行->进入catch
  			console.log('等请求完成再执行')
  		}catch(e){
  			console.log(e)         			//try中遇到错误执行catch
  		}finally{
  			//finally 语句在 try 和 catch 之后无论有无异常都会执行
  		}
  	}
  }，
  onload：{
  	this.getinfo()
  }
```

## 面向对象class

```
//创建类
class FatherClass{
	constructor(name,age){  //每一个类默认都有constructor构造方法
		this.name = name
		this.age = age
	}
	eating(){
		console.log('父类的eating方法')
	}
}

module.export = FatherClass

//创建父类的实例(new)
const son = new FatherClass()
//调用父类的方法
son.eating()

//类的继承(extends)
class Son extends FatherClass {
	constructor(name,age,sonname,sonage){  //每一个类默认都有constructor构造方法
		super(name.age) // super获得父类的this指向 可以使用父类的功能
		this.sonname = sonname
		this.sonage = sonage
	}
	song(){
		console.log(this.name) //父亲
		console.log(this.age) //40
		console.log(this.sonname)//儿子
		console.log(this.sonage)//20
		console.log('son的song方法')
	}
}
//创建继承类的实例+调用继承类自己的方法
const sonn = new Son()
sonn('父亲','40','儿子'，'20').song() //输出：父亲 40 儿子 20 son的song方法

```





