/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-14 15:38:55 
 *  接受中间服务器通知
 */

import axios from "axios"
import { downloadSuccess ,cacheMediaId } from "../common"
import { sendMediaMsg,pushTxtCustomerMsgBatch,
     uploadLocalFilesToWx , downloadFileToLocal, 
     delLocalFile,
     date2StrFormat_$01
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
 * 订阅通知
 * @param {*} ctx 
 */
export async  function subscription(ctx) {
    const wechatMap = ctx.wechatMap 
    const req = ctx.request 
    const body = req.body 
    if(process.env.NODE_ENV.startsWith("dev")) {
        console.log(`接受任务返回数据:${JSON.stringify(body)}`)
    }
    
    ctx.body = {}
    //TODO : 下发模板消息
    const {insUsername,mediaKey,list} = body 
    for(let {openId,wechatId} of list) {
        let wechatApp = wechatMap.get(wechatId) 
        if(wechatApp){
            //TODO 上线后模板id改为线上版本
            wechatApp.pushTemplateMsg(openId,"1lbpOm3yjzGHlKg56K5NL2_uzemI4Gxapof0cqMdZik",{
                data1:{value:insUsername}, 
                data2:{value:date2StrFormat_$01(new Date(),"%Y-%MM-%DD")},
                data3:{value:constant.SUBSCRIPTION_BEIZHU,color:"#ff0033"}
            },`http://www.baidu.com?mediaKey=${mediaKey}`)
        }
    }
    
}

subscription.path = "/subscription" 

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

        //处理caption
        for(let item of locals) {
            if(item.media_ins_type === "caption") { 
                const res = await axios.get(item.media_url) 
                const caption = res.data ? res.data : "" 
                wechatApp.pushTxtCustomerMsg(openid,caption)
                break
            }
        }

        // 处理视频资源
        const msgList =[] 
        for(let item of locals) {
            if(item.media_type === "video" && item.media_ins_type === "item" ) msgList.push(`检测到视频资源，打开下面链接即可保存!\n\n${item.media_url}\n\n 链接有效期一天！`)
        }
        await pushTxtCustomerMsgBatch({wechatApp,openid,msgList})   

        // 处理媒体消息，帖子内容资源 
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
                       fileList.push( {file_type:item.media_type,file_path:decodeURIComponent(item.media_url)} )
                    }
                }

                fileList = await downloadFileToLocal(fileList)  
                const medias = await uploadLocalFilesToWx({wechatApp,fileList})   
                
                if(medias.length > 0) { 
                    sendMediaMsg({wechatApp,openid,media:medias}) 
                }

                ctx.body = {code:200,isMediaCache:true, data:{shortcode,wechat_id,medias},msg:"ok"} 
                
                 //TODO : 注释
                 console.log(medias)
                 console.log("====================================") 
                 console.log(fileList)

                //删除本地临时文件 
                delLocalFile(fileList)

               
            }catch(e) {
               return console.log(e.message) && wechatApp.pushTxtCustomerMsg(openid,e.message)
            }
        }
        
           //成功发送 减少次数放到服务器后台计算
        //    downloadSuccess(openid) 

           //发送小程序卡片
           let res = await wechatApp.pushMiniProgramCardMsg(openid,null,{openid,locals})
           console.log(`小程序弹送结果`,res)
        
    }    
   
}

taskNotify.path = "/taskNotify" 



