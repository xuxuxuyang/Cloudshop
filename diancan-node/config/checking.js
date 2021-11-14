// 公用参数校验
const result = require('./handle.js')

class checking{
	constructor(ctx,...obj) {//...obj接收不固定参数 obj是一个对象类型的
	    this.ctx = ctx
		this.obj = obj	//类数组 [参数1，参数2，参数3]
	}
	// 校验前端传值是否正确
	Errunder(){//如果前端传值参数写错了 接收的参数就是undefined
		let bvc = this.obj.indexOf(undefined)  //indexOf()用来检测->如果要检索的字符串值没有出现，则该方法返回 -1
		if(bvc != -1){
			throw new result('前端参数填写错误',400)
		}
	}
	// 校验手机号码格式是否正确
	Phone(moblie,num){
		let phone = /^1[3456789]\d{9}$/    //检验手机号的正则
		if(!phone.test(this.obj[num])){ //正则用test()方法校验  num为传入参数再参数类数组中的的索引值
			throw new result(moblie,202)
		}
	}
	// 校验密码是否符合要求
	Password(pass,num){
		let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/  //检验6-20位数字和字母结合的正则
		if(!reg.test(this.obj[num])){
			throw new result(pass,202)
		}
	}
	// 校验是否为空数组
	Arrfun(list,num){
		if(JSON.parse(this.obj[num]).length === 0){
			throw new result(list,202)
		}
	}
	// 校验是否为空
	Parameter(list){ 
		let bvc = this.obj.indexOf('')
		if(bvc != -1){
			throw new result(list[bvc],202)
		}
	}
	// 空格符校验
	Blank(list){
		let vbn = this.obj.filter(item=>{
			return item.split(" ").join("").length === 0
		})
		let bvc = this.obj.indexOf(vbn[0])
		if(bvc != -1){
			throw new result(list[bvc],202)
		}
	}
}


// --------------------------------------子类都是为了一次调用多个父类方法----------------------
// 注册校验
class regcheck extends checking{
	start(){
		super.Errunder()
		super.Phone('请填写正确的手机号码',0)
		super.Password('密码必须由6-20位数字和字母的组合',1)
	}
}
// 商家信息上传的校验
class shopinfor extends checking{
	start(){
		let arr = ['请输入店铺名称','请输入店铺地址','请上传店铺logo']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
		super.Arrfun('请上传店铺logo',2)
	}
}
// 类目上传校验
class catecheck extends checking{
	start(){
		let arr = ['请输入菜品类目']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
	}
}
// 添加菜品单位校验
class unitcheck extends checking{
	start(){
		let arr = ['请输入自定义单位']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
	}
}
// 上架菜品校验
class putoncheck extends checking{
	start(){
		let arr = ['请选择菜品类目','请输入菜品名称','请上传菜品图片']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
		super.Arrfun('请上传菜品图片',2)
	}
}
// 上架菜品校验：规格或无规格二选一校验
class newspecs extends checking{
	start(att_hide,att_name,specs){
		let specs_data = JSON.parse(specs)
		if(att_hide == 'true'){
			// 有规格
			if(att_name.split(" ").join("").length == 0){
				throw new result('请输入属性名',202)
			}else{
				let file_data = specs_data.filter(item=>{
					return item.attribute == '' || item.unitprice == '' || item.unit == ''
				})
				if(file_data.length > 0){
					throw new result('请完善菜品规格',202)
				}
			}
		}else{
			// 无规格
			let file_data = specs_data.filter(item=>{
				return item.unitprice == '' || item.unit == ''
			})
			if(file_data.length > 0){
				throw new result('请完善菜品价格和单位',202)
			}
		}
	}
}
//添加桌号
class postcode extends checking{
	start(){
		let arr = ['桌号不能为空']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
	}
}
module.exports = {regcheck,shopinfor,catecheck,unitcheck,putoncheck,postcode,newspecs}