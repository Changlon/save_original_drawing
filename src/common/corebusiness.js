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
export const addDownloadTask = async data => request("/downloadMessionInfo",data,"post")


/**
 * 通知中间服务器用户下次成功
 * @param {*} openid 
 * @returns 
 */
export const downloadSuccess = async openid => request("/downloadSuccess",{openid},"post")




/**
 * 缓存媒体id
 * @param {*} param0  type medias : Array<Object> {type:"image"|"video",media_id:"xxx",thumb_media_id?:"xxx"}
 * @returns 
 */
export const cacheMediaId = async ({shortcode,wechat_id,medias}) => request("/mediaCache",{shortcode,wechat_id,medias},"post",true) 
