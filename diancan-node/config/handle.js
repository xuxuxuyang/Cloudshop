class result extends Error {   //Error是node自带的错误类
	constructor(msg,code) {
		super()
		this.msg = msg
		this.code = code
	}
}

module.exports = result