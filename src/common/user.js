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
 export const userSub = async detail => request({route:"/commonUserSub",data:detail,type:"post"}) 


 

 /**
  * 用户取消关注
  * @param {*} openid 
  * @returns 
  */
// export const userUnSub = async openid => request("/user",{openid},"delete",true)
export const userUnSub = async openid => request({route:"/user",data:{openid},type:"delete",json:true})




/**
 * 获取用户信息
 * @returns 
 */
 export const getCommonUser = async openid => request({route:`user?openid=${openid}`})  



 /**
  * 更新用户数据
  * @param {*} openid 
  * @param {*} nickname 
  * @param {*} avatarUrl 
  * @param {*} phone 
  * @returns 
  */
 export const updateCommonUser = async (openid,nickname,avatarUrl,phone)=> request({route:"/userUpdate",data:{openid,nickname,avatarUrl,phone},type:"put"})



 /**
  * 获取激活码
  * @param {*} openid 
  * @returns 
  */
 export const requestCode = async openid => request({route:"/activationCode/request",data:{openid},type:"post"}) 
 