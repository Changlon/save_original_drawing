
/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-05-26 18:47:55 
 *  推送模板消息模块
 */


/**
 * 万能推送模板
 * @param {*} ctx 
 */
export async function  template (ctx) {  
    const wechatMap = ctx.wechatMap 
    const req = ctx.request 
    const body = req.body 

    if(process.env.NODE_ENV.startsWith("dev")) {
        console.log(`接受任务返回数据:${JSON.stringify(body)}`)
    }

    let {wechatId,templateId, userList, pushBody,url} = body 
    
    if(!wechatId) return ctx.body = {code:500,msg:"缺少 wechatId"}
    if(!templateId) return  ctx.body = {code:500,msg:"缺少 templateId"}
    if(!userList) return  ctx.body = {code:500,msg:"缺少 userList"}
    if(!pushBody) return  ctx.body = {code:500,msg:"缺少 pushBody"}

    let wechatApp = wechatMap.get(wechatId) 

    if(!wechatApp) return {code:500,msg:"不合法的 wechatId"} 
    for(let openid of  userList) {
        if(typeof openid !=="string") {
            return ctx.body = {code:500,msg:"userList中包含不合法的数据 type of userList : string[]"} 
        }
    }

    for(let openid of userList) {
        wechatApp.pushTemplateMsg(openid,templateId,pushBody,url ? url : "")
    }


    ctx.body = {code:200,msg:"ok"}

}

template.path = "/template"