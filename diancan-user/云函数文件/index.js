// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'donghualigongdaxue-7drb78b870209'
})


const db = cloud.database()
const _ = db.command

const category = db.collection('dishes-category')//菜品类目数据库
const dishes = db.collection('dishes-data')//菜品所有数据


// 云函数入口函数event:可以接到前端传来的值
exports.main = async (event, context) => {
// 1.请求数据库的菜品类目的数据
// 2.请求所有菜品的数据
  try {

      const res_cate = await category.where({count:_.gt(0)}).get()
      // console.log(res_cate.data)
      const res_dis = await dishes.where({onsale:true}).get()
      
      let newdata = {}
      res_dis.data.forEach((item,index)=>{
        let {category,cid,...data} = item
        if(!newdata[cid]){
          newdata[cid]  = {
            category,
            cid,
            good_query:[]
          }
        }
        newdata[cid].good_query.push(data)
      })
      let list = Object.values(newdata)
      console.log(list)

      return{
        res_cate:res_cate.data,
        res_dis:list
      }

  } catch (error) {
    return error
  }




















}