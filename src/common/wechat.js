/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-10 14:29:27 
 *  请求公众号服务配置
 */

import request from "../api" 


/**
 * 获取公众号列表
 * @returns 
 */
export const getWechatServers = async () => request.get("/wechatServer") 



/**
 * 添加一个用户任务
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




























