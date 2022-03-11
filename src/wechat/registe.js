
import wechatPub from "koa-wechat-public" 


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



export function injectService(wechatApp) { 
    
}


