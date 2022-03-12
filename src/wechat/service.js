/** 
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-11 13:47:04 
 *  公众号常规业务
 */

import constant from "./constant"

import {
    userSub,
    userUnSub ,
    queueTask,
} from "../common"

export default  [

    //业务事件

    {
        type:"subscribe",
        handler:async acc=>{ 
            acc.send.sendTxtMsg(constant.SUBSCRIBE_INFO)  
            const detail = await acc.consumer.getUserDetail(acc.fromUser) 
            detail.nickname = detail.nickname || `原存图用户`,
            //TODO : 添加默认头像url 
            detail.headimgurl = detail.headimgurl || ""  
            const resData = await userSub(detail)   
            if(resData.code === 0 && resData.msg === "ok") await  acc.send.pushTxtCustomerMsg(acc.fromUser,constant.INITIAL_LINK) 
            else if(resData.code === 0 && resData.msg === "exist") await  acc.send.pushTxtCustomerMsg(acc.fromUser,constant.WELCOME_RESUB)  
        }

    },

    {
        type:"unsubscribe",
        handler:async acc =>{ await userUnSub(acc.fromUser) }
    }, 

    {
        type:"oauth", 
        wechatId:"gh_170e65c7bd09",
        handler:async (data,ctx) =>{ 
            const wechatMap = ctx.wechatMap 
            //TODO: 1. 更新用户昵称，头像; 2. 定向到支付业务页面
        }
    },

    // 业务消息 
    {
        type:'text',
        pattern:constant.INSLINK_POST_REG,
        handler: async acc =>{
             acc.send.sendTxtMsg(constant.SEND_MEDIA_WATING)   
             await queueTask({wechatid:acc.toUser,openid:acc.fromUser,link:acc.content})
        }
    },

    {
        type:'text',
        pattern:constant.INSLINK_IGTV_REG,
        handler: async acc =>{
            acc.send.sendTxtMsg(constant.SEND_MEDIA_WATING)   
            await queueTask({wechatid:acc.toUser,openid:acc.fromUser,link:acc.content})
        }
    },

    {
        type:'text',
        pattern:/客服/g,
        handler: async acc =>{
             acc.send.sendTxtMsg("vx: yuancuntu")  
        }
    },

    {
        type:'text',
        pattern:/.+/,
        handler: async acc =>{
            acc.send.sendTxtMsg(constant.SEND_OTHER_LINK_TIP)
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
    }
   
]



