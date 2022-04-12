/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-14 15:38:55 
 *  接受中间服务器通知
 */


import { downloadSuccess ,cacheMediaId } from "../common"
import { sendMediaMsg,pushTxtCustomerMsgBatch,
     uploadLocalFilesToWx , downloadFileToLocal, 
     delLocalFile
    } from "../wechat/utils"

import constant from "../wechat/constant" 


/**
 * 任务失败通知
 * @param {*} ctx 
 */    
export async function taskFailed(ctx) {  

    const wechatMap = ctx.wechatMap 
    const req = ctx.request 
    const body = req.body 
    
    if(process.env.NODE_ENV.startsWith("dev")) {
        console.log(`接受失败返回数据:${JSON.stringify(body)}`)
    }
    
    // 获取用户 openid , wechatid  , total 链接包含的总资源数量
    const {openid,wechat_id,shortcode} = body    
    
    if( openid === undefined || wechat_id === undefined || !shortcode ) return  ctx.body = {code:500,msg:"参数不足"}
    const wechatApp = wechatMap.get(wechat_id)  
    if(wechatApp === undefined || !wechatApp) return ctx.body = {code:500,msg:`未查询到对应的公众号实例 wechat_id not found !: ${wechat_id}`} 
    ctx.body = {code:200,isMediaCache:false, msg:"ok"} 
    wechatApp.pushTxtCustomerMsg(openid, constant.SERVER_ERRROR_INFO)
}

taskFailed.path = "/taskFailed"
    

/**
 * 接受任务成功返回通知
 * @param {*} ctx 
 */
 export async function taskNotify(ctx) {    
   
    const wechatMap = ctx.wechatMap 
    const req = ctx.request 
    const body = req.body 
    
    if(process.env.NODE_ENV.startsWith("dev")) {
        console.log(`接受任务返回数据:${JSON.stringify(body)}`)
    }
    
    // 获取用户 openid , wechatid  , total 链接包含的总资源数量
    const {openid,wechat_id,shortcode,medias,locals,total} = body   

    if( openid === undefined || wechat_id === undefined || !shortcode || 
        locals ===undefined || total ===undefined ) return  ctx.body = {code:500,msg:"参数不足"}
    const wechatApp = wechatMap.get(wechat_id)  
    if(wechatApp === undefined || !wechatApp) return ctx.body = {code:500,msg:`未查询到对应的公众号实例 wechat_id not found !: ${wechat_id}`} 

    if(typeof total === "number" && total > 0 ) {
        await wechatApp.pushTxtCustomerMsg(openid,`检测到${total}个资源`)
        // 将视频链接发送
        const msgList =  locals.filter(item=>item.media_type === "video" ? `复制下面链接浏览器保存!\n\n${item.media_url}`: null)  
        pushTxtCustomerMsgBatch({wechatApp,openid,msgList})   

        // 有媒体id 发送媒体id , 有视频资源 ？ 有发送链接或者小程序   
        if(medias) {
            console.log(`media缓存 ${JSON.stringify(medias)}`) 
            sendMediaMsg({wechatApp,openid,media:medias})  
            ctx.body = {code:200,isMediaCache:false, msg:"ok"}
        }else{
          
            try {
                  // 没有媒体id ,图片上传到微信服务器获取媒体id , 发送给用户  
                let fileList = [] 

                for(let item of locals) {
                    if(item.media_type === "image"  && item.media_ins_type === "item" ) {
                       fileList.push( {file_type:item.media_type,file_path:item.media_url} )
                    }
                }

                //TODO : 去掉 
                console.log("====================================") 
                console.log(fileList)
                console.log("====================================") 

                fileList = await downloadFileToLocal(fileList)  

                const medias = await uploadLocalFilesToWx({wechatApp,fileList})   

                ctx.body = {code:200,isMediaCache:true, data:{shortcode,wechat_id,medias},msg:"ok"} 

                 //TODO : 注释
                 console.log(medias)

                 console.log("====================================") 
                 console.log(fileList)

                //删除本地临时文件 
                delLocalFile(fileList)
                
                if(medias.length > 0) { 
                    sendMediaMsg({wechatApp,openid,media:medias}) 
                   
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



