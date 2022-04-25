/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-12 23:45:42 
 *  公众号用户接口 
 */


 import request from "../api" 


 

 /**
  * 用户关注
  * code 0 ok 添加成功
  * code 1 exist 用户关注过
  * @param {*} detail 
  * @returns 
  */
//  export const userSub = async detail => request("/user",detail,"post",true)
 export const userSub = async detail => request({route:"/user",data:detail,type:"post",json:true}) 


 

 /**
  * 用户取消关注
  * @param {*} openid 
  * @returns 
  */
// export const userUnSub = async openid => request("/user",{openid},"delete",true)
export const userUnSub = async openid => request({route:"/user",data:{openid},type:"delete",json:true})




 