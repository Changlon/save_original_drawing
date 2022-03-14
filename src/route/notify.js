/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-14 15:38:55 
 *  接受中间服务器通知
 */



/**
 * 接受任务返回通知
 * @param {*} ctx 
 */
 export async function taskNotify(ctx) {    

    const wechatMap = ctx.wechatMap 
    const req = ctx.request 
    const body = req.body 

    //TODO : 

    // 获取用户 openid , wechatid  
    const {openid,wechatid} = body
   
    // 获取公众号实例 
    const wechatApp = wechatMap.get(wechatid)  


    // 缓存判断 
    

    

    // 发送消息给用户

    
}

taskNotify.path = "/taskNotify" 



