const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const result = require('../config/handle.js')

const secretkey = "abcdefg"//参与加密token的值

class Auth{
	constructor() {}
	// 取值函数  set:存值函数
	get m(){//中间件函数
		return async(ctx,next)=>{
			const token = basicAuth(ctx.req)
			if(!token || !token.name){  //验证是否有token
				throw new result({errcode:'401',msg:'没有访问权限'},401)
			}
			try{
				var authcode = jwt.verify(token.name,secretkey) //验证token的合法性
			}catch(error){
				if(error.name == 'TokenExpiredError'){ //TokenExpiredError表示token过期
					throw new result({errcode:'401',msg:'账号过期,请重新登陆'},401)
				}
				throw new result({errcode:'401',msg:'没有访问权限'},401)
			}
			ctx.auth = {
				uid: authcode.uid
			}
			await next()
		}
	}
}

module.exports = {Auth}