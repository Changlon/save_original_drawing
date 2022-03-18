/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-14 16:41:32 
 */

import wechatPub from "koa-wechat-public" 



/**
 * 批量上传临时|永久文件到微信素材库,默认是临时
 * @param {*} param0 
 * @returns 
 */
export async function uploadLocalFilesToWx({wechatApp,fileList, tmp = false}) { 
    if(!(wechatApp instanceof wechatPub)) return  console.log(`uploadLocalFilesToWx failed ! param typeError -> wechatApp is not instance of Class koa-wechat-public`) && undefined
    if(!fileList || (typeof fileList !== "object") ) return console.log(`uploadLocalFilesToWx failed ! param typeError -> fileList ${fileList}`)  && undefined  
    
    let medias = [] 
    
    for(let {file_type,file_path} of fileList) {  
        const {type,media_id} = await wechatApp.addTmpMaterial(file_path,file_type)  
        media_id && type ? medias.push({media_id,media_type:type}) : void 0 
    }

    return medias 
}




/**
 * 批量发送客服文本消息
 * @param {*} param0 
 */
export async function pushTxtCustomerMsgBatch({wechatApp,openid,msgList}) { 
    if(!(wechatApp instanceof wechatPub)) return  console.log(`pushTxtCustomerMsgBatch failed ! param typeError -> wechatApp is not instance of Class koa-wechat-public`) && undefined
    if(!msgList || (typeof msgList !== "object") || !(msgList instanceof Array)) return console.log(`pushTxtCustomerMsgBatch failed ! param typeError -> msgList ${msgList}`)  && undefined  
    let success= 0 
    for(let msg of msgList) { 
        const {errmsg} =  await wechatApp.pushTxtCustomerMsg(openid,msg) 
        errmsg === "ok" ? success++ : success = success
    }
    return success 
}




/**
 * 公众号发送媒体消息
 * @param {*} param0 
 * @returns 
 */
export async function  sendMediaMsg({
    wechatApp, 
    openid,
    media 
}) {
    
    if(! wechatApp instanceof wechatPub) return  console.log(`sendMediaMsg failed ! param typeError -> wechatApp : ${wechatApp} is not instance of Class koa-wechat-public`) && undefined
    if(!openid) return console.log(`sendMediaMsg failed ! param typeError -> openid ${openid}`)  && undefined
    if(!media) return console.log(`sendMediaMsg failed ! param typeError -> media ${media}`)  && undefined
    
    if(media instanceof Array) { 
        let successNum  = 0  
        for(let item of media) {  
          const isOk =  await sendMediaMsg({wechatApp,openid,media:item})   
          successNum = successNum + isOk 
        }
        return successNum  
    }
    
    const {media_type,media_id,thumb_media_id} = media 

    let res 
    
    switch(media_type) {
        case "image":
            res =  await wechatApp.pushImageCustomerMsg(openid,media_id) 
            break
        case "video": 
            res = await wechatApp.pushVideoCustomerMsg(openid,media_id,thumb_media_id) 
            break 
    }
    
    if(res.errmsg === "ok") return 1
    else return 0 
}



/**
 * 解析ins链接
 * @param {*} link 
 */
export  function parseInsLink(content) {  
    const ISINSLINK = new RegExp("http(s)?://(www.)?instagram.com/","g")
    const PARSE_URL = /(\w+):\/\/(www\.)?instagram.com(.+)\//
    if(!ISINSLINK.test(content)) return  
    const urlPatterns = PARSE_URL.exec(content)      
    const link = urlPatterns[0] 
    const pathArr = urlPatterns[3].split("/") 
    pathArr.shift()
    let username , type , shortcode 
    
    if(pathArr.length===1){ 
        type = "profile", username = pathArr[0]  
    }else if (pathArr.length ===2){ 
        type = pathArr[0] , shortcode = pathArr[1]
    }else if(pathArr.length ===3) { 
        username = pathArr[0] ,type = pathArr[1] ,shortcode = pathArr[2]
    }

    return {
        link,
        username,
        type,
        shortcode 
    }
    
}



