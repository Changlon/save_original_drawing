/** 
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-11 13:47:04 
 *  公众号常规业务
 */

import constant from "./constant"
import {
    parseInsLink,
    uploadLocalFilesToWx
} from "./utils"
 
import path from "path"

import {
    userSub,
    userUnSub ,
    addDownloadTask,
    updateCommonUser,
    requestCode,
} from "../common"

import rq from "../api"
import { stat } from "fs"

export default  [

    //业务事件

    {
        type:"subscribe", /** 订阅 */
        handler:async acc=>{ 
            await acc.send.sendTxtMsg(constant.SUBSCRIBE_INFO)  
            setTimeout(async ()=>{
                const detail = await acc.consumer.getUserDetail(acc.fromUser) 
                const commonUser = {} 
                commonUser.nickname = `inscarry${new Date().getTime()}`
                commonUser.wechatId = acc.toUser
                commonUser.openid = detail.openid 
                commonUser.unionid = detail.unionid
                commonUser.sex = detail.sex 
                commonUser.language = detail.language 
                commonUser.city = detail.city 
                commonUser.province = detail.province 
                commonUser.country = detail.country 
               
                const resData =  await userSub(commonUser)
                if(resData.code === 0 ) await  acc.send.pushTxtCustomerMsg(acc.fromUser,constant.INITIAL_LINK) 
                else if(resData.code === 1) await  acc.send.pushTxtCustomerMsg(acc.fromUser,constant.WELCOME_RESUB)  
            }) 
        }
    },

    {
        type:"unsubscribe", /**取消订阅 */
        handler:async acc =>{  userUnSub(acc.fromUser) }
    }, 

    {
        type:"oauth", /** 授权验证 */
        /** app 对应的公众号实例, this指向app */
        handler:async (data, ctx , app) =>{ 
             let {access_token,openid,state} = data 
            
            let res = await rq({baseUrl:`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`}) 
            let {nickname,headimgurl} = res 
            
            if(state === "order") { 
                /** 更新用户信息 */ 
                try {
                    updateCommonUser(openid,nickname,headimgurl,null)
                } catch (error) {
                    console.log(error)
                }
              
            }
            /** 定向到支付业务页面 */  
            ctx.response.redirect(`https://api.inscarry.com/#/${state}?openid=${openid}`)  
        }
    },



    // 业务消息 

    {
        type:'text',
        pattern:/客服/g,
        handler: async acc =>{
            acc.send.sendTxtMsg("inscarry存图小助手") 
            const mediaList = await uploadLocalFilesToWx({wechatApp:acc.context, fileList:[{file_type:"image",file_path:path.join(__dirname,"./assets/question-kefu.jpg") }]})  
            acc.send.pushImageCustomerMsg(acc.fromUser,mediaList[0].media_id)
        }
    },

    {
        type:"text",
        pattern:/小程序/g,
        handler: async acc =>{ 
            acc.send.sendTxtMsg("inscarry存图小程序") 
            // let res = await  acc.material.addLongTimeMaterial(path.join(__dirname,"./assets/mpSave.jpg"),"image")
            // console.log(res)   
            //发送小程序卡片
            acc.send.pushMiniProgramCardMsg(acc.fromUser,null,{})
            
        }
    },
    
    
    {
        type:'text',
        pattern:/激活码/g,
        handler: async acc =>{ 
            let res =  await requestCode(acc.fromUser) 
           if(res.code === 500) {
             acc.send.sendTxtMsg(`${res.data} \n ${constant.NOT_VIP_NOTIFICATION.replace("{{APPID}}",acc.context.config.appId)}`) 
           }else {
             let {codeStr } = res.data
             acc.send.sendTxtMsg(`您的激活码为:\n ${codeStr} \n <a href="https://docs.inscarry.com/extension/download.html">\uE231 查看激活码使用教程 </a>`) 
           
           }

            
        }
    },


    {
        type:"image",
        handler:async acc=>{
         acc.send.sendTxtMsg(constant.SEND_CONTENT_UNIDENTIFIABLE)
        } 
    },

    {
        type:"voice",
        handler:async acc=>{
            acc.send.sendTxtMsg(constant.SEND_CONTENT_UNIDENTIFIABLE)

        } 
    },

    {
        type:"video",
        handler:async acc=>{
            acc.send.sendTxtMsg(constant.SEND_CONTENT_UNIDENTIFIABLE)
        } 
    },


    {
        type:'text', /** ins链接业务 */
        pattern:/.+/,
        handler: async acc =>{
                const content = acc.content 
                if(!constant.ISINSLINK.test(constant) && !constant.INSLINK_POST_REG.test(content) && !constant.INSLINK_IGTV_REG.test(content))  {
                    await acc.send.sendTxtMsg(constant.SEND_OTHER_LINK_TIP)
                }else{
                    await acc.send.sendTxtMsg(constant.SEND_MEDIA_WATING)  
                    setTimeout(async ()=>{
                        const result = parseInsLink(content) 
                        result.wechat_id = acc.toUser , result.openid = acc.fromUser , result.scene = "wechat" 
                    
                        try { 
                            let res = (await addDownloadTask(result))   
                            console.log(res)
                            
                            if(res.code !== 0) {
                            acc.send.pushTxtCustomerMsg(acc.fromUser,res.msg)
                            }

                        }catch(e) {
                            // acc.send.pushTxtCustomerMsg(acc.fromUser, constant.SERVER_ERRROR_INFO)
                        }
                    
                    })
                }
        }
    }

]



