

import { uploadLocalFilesToWx} from "./utils" 
import path from "path"
import { getCommonUser } from "../common"
import constant from "./constant"
/** 菜单配置 */
export const menu = [
    {
        "name":"使用教程",
        "sub_button":[
            {"type":"view","name":"\ue21c 入门教程","url":"https://docs.inscarry.com"},
            {"type":"view","name":"\ue21d 公众号下载教程","url":"https://docs.inscarry.com/wechat/follow.html"},
            {"type":"view","name":"\ue21e 浏览器插件教程","url":"https://docs.inscarry.com/extension/download.html"},
            {"type":"view","name":"\ue21f 常见问题&客服","url":"https://docs.inscarry.com/question/common.html"}
        ]
    },

    {
        "name":"高级功能",
        "sub_button":[
            {"type":"click","name":"存图小程序🔥","key":"V1001_mp"},
            {"type":"view","name":"明星大全🌟","url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid={{APPID}}&redirect_uri=" + constant.REDIRECT_URL+"{{REDIRECT_ROUTE}}&response_type=code&scope=snsapi_userinfo&state=sub#wechat_redirect"},
            {"type":"view","name":"博主订阅🏆","url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid={{APPID}}&redirect_uri=" + constant.REDIRECT_URL+"{{REDIRECT_ROUTE}}&response_type=code&scope=snsapi_userinfo&state=sub#wechat_redirect"},
            {"type":"view","name":"批量下载🚀","url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid={{APPID}}&redirect_uri=" + constant.REDIRECT_URL+"{{REDIRECT_ROUTE}}&response_type=code&scope=snsapi_userinfo&state=home#wechat_redirect"},
            {"type":"view","name":"插件下载\ue233","url":"https://www.inscarry.com/#purches-area"} 
        ]
    }, 

    {
        "name":"个人中心",
        "sub_button":[
            {"type":"view","name":"会员中心👑","url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid={{APPID}}&redirect_uri=" + constant.REDIRECT_URL +"{{REDIRECT_ROUTE}}&response_type=code&scope=snsapi_userinfo&state=order#wechat_redirect"},
            {"type":"click","name":"联系客服","key":"V1002_kefu"},
            {"type":"view","name":"产品介绍","url":"https://www.inscarry.com"}
        ]

    }
] 





/** 菜单事件配置 */
export const menuEvent = {
    "V1001_mp" : async acc =>{          
        // TODO: 检测是否开通SVIP   
        let  {data} = await getCommonUser(acc.fromUser) 
        
        /** 未开通vip */
        if(data.isVip === 0  && data.isSvip === 0) { 
            return await acc.send.sendTxtMsg(constant.NOT_VIP_NOTIFICATION.replace("{{APPID}}",acc.context.config.appId).replace("{{REDIRECT_ROUTE}}",acc.context.opt.route))
        }

        await acc.send.sendTxtMsg(`<a data-miniprogram-appid="wx04cb6f91aee1ec15" data-miniprogram-path="pages/search/search?openid=${acc.fromUser}" href="https://www.inscarry.com" >\uE231 点击使用小程序存图</a>️ `)

    },

    "V1002_kefu":async acc =>{
        acc.send.sendTxtMsg("inscarry存图小助手") 
        const mediaList = await uploadLocalFilesToWx({wechatApp:acc.context, fileList:[{file_type:"image",file_path:path.join(__dirname,"./assets/question-kefu.jpg") }]})  
        acc.send.pushImageCustomerMsg(acc.fromUser,mediaList[0].media_id)
    }, 


}
