/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-12 23:47:15 
 *  核心业务逻辑接口 
 */



 import request from "../api" 
 

/**
 * 添加一个任务
 * @param {*} param0 
 * @returns 
 */
export const queueTask = async ({wechatid,openid,link,shortcode,type})=> request.post("/wechatTask",{
    wechatid,
    openid,
    link,
    shortcode,
    type
})
