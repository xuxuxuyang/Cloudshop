const jwt = require('jsonwebtoken')

const secretkey = "abcdefg"//参与加密token的值
const expiresIn = 60*60*24*7//过期时间

// token加密生成
function gentoken(uid,scope = 2){
	const token = jwt.sign({uid,scope},secretkey,{expiresIn}) //第一个参数对象写入要加密的值
	return token
}

module.exports = {gentoken}