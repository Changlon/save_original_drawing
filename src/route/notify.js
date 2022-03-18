/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-14 15:38:55 
 *  接受中间服务器通知
 */


import { downloadSuccess ,cacheMediaId } from "../common"
import { sendMediaMsg,pushTxtCustomerMsgBatch, uploadLocalFilesToWx } from "../wechat/utils"

/**
 * 接受任务返回通知
 * @param {*} ctx 
 */
 export async function taskNotify(ctx) {    
   
    const wechatMap = ctx.wechatMap 
    const req = ctx.request 
    const body = req.body 

    // 获取用户 openid , wechatid  , total 链接包含的总资源数量
    const {openid,wechat_id,link,medias,locals,total} = body   

    if(!openid || !wechat_id || !link || !locals || !total) return  ctx.body = {code:500,msg:"参数不足"}
    
    const wechatApp = wechatMap.get(wechat_id)  

    if(typeof total === "number" && total > 0 ) {
        await wechatApp.pushTxtCustomerMsg(openid,`检测到${total}个资源`)

        // 将视频链接发送
        const msgList =  locals.filter(item=>item.file_type === "video" ? `复制下面链接浏览器保存!\n\n${item.file_url}`: null)  
        pushTxtCustomerMsgBatch({wechatApp,openid,msgList})   

        // 有媒体id 发送媒体id , 有视频资源 ？ 有发送链接或者小程序  
        if(medias) {
            sendMediaMsg({wechatApp,openid,media:medias})  
        }else{
            
             // 没有媒体id ,图片上传到微信服务器获取媒体id , 发送给用户  
            const fileList =  locals.filter(item=>item.file_type === "image" ? {file_type:item.file_type,file_path:item.file_path}: null)  
            const medias = await uploadLocalFilesToWx({wechatApp,fileList})  
            
            if(medias.length > 0) { 
                sendMediaMsg({wechatApp,openid,media:medias})
                cacheMediaId({link,wechat_id,medias})
            }
        }

       //成功发送
      downloadSuccess(openid) 

    }

    //返回请求
    ctx.body = {code:0, msg:"ok"}
}




taskNotify.path = "/taskNotify" 



