/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-12 23:47:15 
 *  核心业务逻辑接口 
 */



 import request from "../api" 
 

/**
 * 用户添加一个下载任务
 * @param {*} param0 
 * @returns 
 */
export const addDownloadTask = async ({wechat_id,openid,link,shortcode,type,scene = "wechat"})=> request.post("/downloadMessionInfo",{
    wechat_id,
    openid,
    link,
    shortcode,
    type,
    scene
})



/**
 * 用户下次成功
 * @param {*} openid 
 * @returns 
 */
export const downloadSuccess = async openid => request.post("/downloadSuccess",{openid})




