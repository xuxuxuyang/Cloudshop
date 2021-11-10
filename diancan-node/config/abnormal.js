const result = require('./handle.js')// 自定义的全局异常处理中间件

const abnormal = async(ctx,next)=>{
	try{
		await next()		//所有的中间件都会走一次这里
	}catch(err){
		console.log(err)
		const isresult = err instanceof result   // instanceof 用于判断一个变量是否是某个对象的实例 可以用来检测是否属于已知的错误
		if(isresult){		// 已知错误
			ctx.body = {
				msg:err.msg
			}
			ctx.status = err.code
		}else{				// 未知错误
			ctx.body = {
				msg:'服务器发生错误'
			}
			ctx.status = 500
		}
	}
}
module.exports = abnormal