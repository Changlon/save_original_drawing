/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-14 16:41:32 
 */

import wechatPub from "koa-wechat-public" 
import axios  from "axios" 
import fs from "fs"
import path from "path" 
import cryptoJs from "crypto-js"


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
 * 是否是svip
 * @param {*} commonUser 
 * @returns 
 */
export function isSvip(commonUser) {
    let isExpired = vipIsExpired(commonUser)
    if(isExpired) return false   
    let expireTime = commonUser.expireTime
    let yearVipExpireTime = 31104000000 //一年时间
    return !isExpired && (expireTime >= yearVipExpireTime ) 
}


/**
 * 检查会员是否到期
 * 过期 true 
 * 没过期 false 
 * @param {*} commonUser 
 */
export function vipIsExpired(commonUser) {  
    if(!commonUser) return true 
    if(commonUser.isVip === 0 ) return true 
    if( !commonUser.vipStart ||  !commonUser.expireTime) return true 
    let targetTime = new Date(commonUser.vipStart).getTime() + commonUser.expireTime 
    let currentTime = new Date().getTime() 
    return currentTime > targetTime 
}




/**
 * 日期转指定的字符格式
 * @param {*} date 
 * @param {*} formate 
 * @returns  
 *  %Y->表示满年占位符 2022  %y表示小年占位符 22 
 *  %M ->表示单数月 1    %MM -> 表示双数月01 
 *  %D ->单数日 %DD-> 双数日 
 */

 export function date2StrFormat_$01(date,format) {     
    if(!date instanceof Date) return 
    const year =  date.getFullYear() 
    const month = ( date.getMonth() + 1 ) < 10 ?  "0" + ( date.getMonth() + 1 ) :( date.getMonth() + 1 )
    const day   = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()  
    format = format ? format : "%Y-%M-%D"   
    format = format.replace("%MM",month) 
    format = format.replace("%DD",day) 
    format =  format.replace("%Y",year) 
    format = format.replace("%M",date.getMonth()+1)
    format = format.replace("%D",date.getDate()) 
    return format
}


/**
 * 获取sign
 * @returns 
 */

 export  function getSign(){
    let timestamp =  new Date().getTime()
    timestamp = (timestamp + "").substring(0,9) 
    let time_base_64 =  cryptoJs.enc.Base64.stringify(
        cryptoJs.enc.Utf8.parse(timestamp)
    ) 
    let hmacMd5 =  cryptoJs.HmacMD5( time_base_64 ,cryptoJs.enc.Base64.parse("YWRmMzViOTFjOTU2ZTYzZjdkZTc5YzU1MTNmNTgyM2U="))   
    return hmacMd5.toString()
} 



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
export  

function parseInsLink(content) {  
     
    const ISINSLINK = new RegExp("http(s)?://(www.)?instagram.com/","g")
    const PARSE_URL = /(\w+):\/\/(www\.)?instagram.com(.+)\// 
    const PARSE_PROFILE_URL = /(\w+):\/\/(www\.)?instagram.com(.+)\?/
    if(!ISINSLINK.test(content)) return  
    let urlPatterns = PARSE_URL.exec(content)  
    
    let link, username , type , shortcode , shortcodeLength
    
    if(!urlPatterns) {
        urlPatterns = PARSE_PROFILE_URL.exec(content) 
        link = urlPatterns[0]
        link = link.substring(0,link.length-1) + "/"
        username = urlPatterns[3].substring(1) 
        let linkType = type =  "index" 
        return {
            link:link.indexOf("https://instagram")>=0 ? link.replace("https://instagram","https://www.instagram") : link,
        username,
        type,
        linkType,
        shortcode ,
        shortcodeLength
        }
    }

    link = urlPatterns[0] 
    const pathArr = urlPatterns[3].split("/") 
    pathArr.shift()
  
    if(pathArr.length===1){ 
        type = "index", username = pathArr[0]  
    }else if (pathArr.length ===2){ 
        type = pathArr[0] , shortcode = pathArr[1]
    }else if(pathArr.length ===3) { 
        if(pathArr[0]!=="stories") {
            username = pathArr[0] ,type = pathArr[1] ,shortcode = pathArr[2]
        }else{
            username = pathArr[1],type = pathArr[0],shortcode = pathArr[2]
        }

        shortcodeLength = shortcode ? shortcode.length : 0 
    }

    return {
       link:link.indexOf("https://instagram")>=0 ? link.replace("https://instagram","https://www.instagram") : link,
        username,
        type,
        shortcode ,
        shortcodeLength
    }
}
