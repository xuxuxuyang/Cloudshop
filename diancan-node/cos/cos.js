const multer = require('@koa/multer')
const COS = require('cos-nodejs-sdk-v5'); //腾讯云的cos模块
var cos = new COS({
   SecretId: 'AKIDILyLZnHgJflu1snk2PWMxINOBlX4wM7c',
   SecretKey: 'KNBj12npb4GCuOcdRXMuCE0UifNqDKXU',
   Protocol:'https:'
});

let Bucket = 'txcos-1303996666'
let Region = 'ap-guangzhou'

let cosfun = function(filename,path){
	return new Promise((resolve,reject)=>{
		cos.uploadFile({
			Bucket,
			Region,
			Key: 'diancan/' + filename,              /* 设置存到那个文件夹 */
			FilePath: path,  
			// sliceSize:1024*1024*5  //触发分块上传的阈值 这里表示超过5MB使用
		})
		.then(res=>{
			resolve(res.Location)//返回cos生成的https图片链接
		})
		.catch(err=>{
			reject(err)
		})
	})
}

// 二进制上传 （处理生成的小程序码）
let buffer = function(filename,path){
	return new Promise((resolve,reject)=>{
		cos.putObject({
			Bucket,
			Region,
			Key: 'image/' + filename,  
			Body: Buffer.from(path),  
		})
		.then(res=>{
			resolve(res.Location)//返回cos生成的https图片链接
		})
		.catch(err=>{
			reject(err)
		})
	})
} 
// 配置上传文件1.所在的目录和2.更改文件名
const storage = multer.diskStorage({//磁盘存储引擎方法
	destination:(req, file, cb)=> {//存储前端传来的文件
	    cb(null, 'upload/image')
	},
	filename:(req, file, cb)=> {// 防止文件重名更改前缀
	   let fileFormat = (file.originalname).split(".")
	   let num = `${Date.now()}-${Math.floor(Math.random(0,1) * 10000000)}${"."}${fileFormat[fileFormat.length - 1]}`
	   cb(null,num)
	 }
})

const upload = multer({ storage})

module.exports = {upload,cosfun,buffer}