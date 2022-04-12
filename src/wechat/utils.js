/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-14 16:41:32 
 */

import wechatPub from "koa-wechat-public" 
import axios  from "axios" 
import fs from "fs"
import path from "path" 


// downloadFileToLocal([
//     {
//       file_type: 'image',
//       file_path: 'https://ins-1310702628.cos.ap-beijing.myqcloud.com/common/nasa/Cba84meJxb3/item1.jpeg?q-sign-algorithm=sha1&q-ak=AKIDITbhyAILIAwcCh6Pcmuy00v5saDlEdwB&q-sign-time=1649745283%3B1649831683&q-key-time=1649745283%3B1649831683&q-header-list=host&q-url-param-list=&q-signature=a5ffcc33b7c2a9bd0c4b8dab3b71a03ee94e1dc5'
//     }
//   ]).then(res=>{
//       console.log(res)
//       for(let {file_path} of res) {
//         delLocalFile(file_path) 
//       }

//   })


// delLocalFile("D:\\CodeFiles\\workplace\\ins\\save_original_drawing\\src\\wechat\\1649746872683.jpg")

/**
 * 删除本地文件
 * @param {*} filepath 
 */
export function delLocalFile(fileList) { 
    for(let {file_path} of fileList) {
        if(fs.existsSync(file_path)) {
            fs.unlink(file_path,()=>{})
         }
    }
   
}


/**
 * 下载url 到本地
 * @param {*} fileList 
 */
export async function downloadFileToLocal(fileList) {  
    const res = []
    for(let {file_path,file_type} of fileList) { 
        if(!file_path || !file_type) continue 
        const {data} = await axios({
                url:file_path,
                responseType:"arraybuffer"
            })
        
        const filepath = path.join(__dirname,`./${new Date().getTime()}${ 
            file_type === 'image' ? 
            '.jpg': '.mp4'}`)
        fs.writeFileSync(filepath,data,"binary")   
        res.push({file_type,file_path:filepath}) 
    }
    return res
}



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
    
    if(!wechatApp || ! (wechatApp instanceof wechatPub)) return  console.log(`sendMediaMsg failed ! param typeError -> wechatApp : ${wechatApp} is not instance of Class koa-wechat-public`) && undefined
    if(!openid || typeof openid!=="string") return console.log(`sendMediaMsg failed ! param typeError -> openid ${openid}`)  && undefined
    if(!media) return console.log(`sendMediaMsg failed ! param typeError -> media ${media}`)  && undefined
    
    if(media instanceof Array) { 
        let successNum  = 0  
        for(let item of media) {  
          const isOk =  await sendMediaMsg({wechatApp,openid,media:item})   
          successNum = successNum + isOk 
        }
        return successNum  
    }
    
    let  {type,media_type,media_id,thumb_media_id} = media  
    media_type = media_type  ? media_type: type
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



