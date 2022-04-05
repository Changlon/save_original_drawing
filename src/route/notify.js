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
    
    if(process.env.NODE_ENV.startsWith("dev")) {
        console.log(`请求数据:${JSON.stringify(body)}`)
    }
    

    // 获取用户 openid , wechatid  , total 链接包含的总资源数量
    const {openid,wechat_id,shortcode,medias,locals,total} = body   

    if(!openid || !wechat_id || !shortcode || !locals || !total) return  ctx.body = {code:500,msg:"参数不足"}
    
    const wechatApp = wechatMap.get(wechat_id)  

    if(typeof total === "number" && total > 0 ) {

        await wechatApp.pushTxtCustomerMsg(openid,`检测到${total}个资源`)

        // 将视频链接发送
        const msgList =  locals.filter(item=>item.file_type === "video" ? `复制下面链接浏览器保存!\n\n${item.file_url}`: null)  
        pushTxtCustomerMsgBatch({wechatApp,openid,msgList})   

        // 有媒体id 发送媒体id , 有视频资源 ？ 有发送链接或者小程序  
        if(medias) {
            sendMediaMsg({wechatApp,openid,media:medias})  
            ctx.body = {code:200, msg:"ok"}
        }else{
            
            try {
                  // 没有媒体id ,图片上传到微信服务器获取媒体id , 发送给用户  
                const fileList =  locals.filter(item=>item.file_type === "image"  && item.ins_type === "item" ? {file_type:item.file_type,file_path:item.file_path}: null)  
                const medias = await uploadLocalFilesToWx({wechatApp,fileList})  
                
                if(medias.length > 0) { 
                    sendMediaMsg({wechatApp,openid,media:medias})
                    ctx.body = {code:200, msg:"ok",data:{shortcode,wechat_id,medias}}
                }

            }catch(e) {
                console.log(e.message)
            }
        }
       //成功发送
      downloadSuccess(openid) 

    }

    
   
}




taskNotify.path = "/taskNotify" 



