
import wechatPub from "koa-wechat-public" 
import service from "./service" 

/**
 * 注册一个或者多个公众号服务
 * @param {*} opt 
 */
export function registe (opt) { 
    if(!opt || typeof opt !== "object") return 
    if(opt instanceof Array) {
        const arr = [] 
        for(let i = 0;i<opt.length;++i) {
            const app = registe(opt[i])
            if(app && app instanceof wechatPub) arr.push(app)
        }
        return arr 
    }

    const {
        appid,
        appsecret,
        token,
        encoding_aes_key 
    }  = opt

    
    
    if(!appid || !appsecret || !token) return 

    const app =  new wechatPub({
        appId:appid,
        appSecret:appsecret,
        token:token,
        encodingAESKey:encoding_aes_key
    })

    app.opt = opt 

    return app 

}




/**
 * 注入公众号服务
 * @param {*} wechatApp 
 */
export function injectService(wechatApp) { 
    if(!wechatApp || typeof wechatApp !== "object" || !( wechatApp instanceof wechatPub ) ) return 
    if(!wechatApp.opt.wechatId) return console.debug("wechat - injectService : wechatApp need opt wechatId")
    for(let {type,pattern,wechatId,handler} of service) {
        if(wechatId && wechatId.trim() !== wechatApp.opt.wechatId.trim()) continue  
        switch (type)  {
            case "text": 
                handler && wechatApp.text(pattern? pattern : /.+/g,handler)
                break
            case "image":  
                handler && wechatApp.image(handler)   
            case "video" : 
                handler && wechatApp.video(handler) 
                break 
            case "voice" : 
                handler && wechatApp.voice(handler)  
                break
            case "subscribe":  
                handler && wechatApp.subscribe(handler) 
                break
            case "unsubscribe": 
                handler && wechatApp.unsubscribe(handler) 
                break
            case "menu": 
                handler && wechatApp.menu(handler)  
                break
            case "oauth": 
                handler && wechatApp.oauth(handler)  
                break
        }
    }
}


