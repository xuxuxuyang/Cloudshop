const Koa = require('koa')
const app = new Koa()
const cors = require('koa2-cors')
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
app.use(cors())
app.use(json())
app.use(bodyParser())

// 全局异常处理
const abnormal = require('./config/abnormal.js')
app.use(abnormal)

/* 启动路由 */
const router = require('koa-router')()//实例化new路由
	const login = require('./router/login/login.js')// 注册；登录
	const uploadres = require('./router/merchant-infor/infor.js')// 商家设置
	const dish = require('./router/dish-manage/dish')// 菜品管理
	const oreder = require('./router/order/order.js')// 订单
	const code = require('./router/qr-code/code.js')// 桌号管理
	router.use('/api',login)
	router.use('/api',uploadres)
	router.use('/api',dish)
	router.use('/api',oreder)
	router.use('/api',code)
app.use(router.routes())
app.use(router.allowedMethods())

// 自定义启动端口5000：不能跟其他程序的启动端口一样，否则造成端口冲突
app.listen(5000);

console.log('5000端口服务器启动成功')
