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


    // 有媒体id 发送媒体id , 有视频资源 ？ 有发送链接或者小程序 



    // 没有媒体id ,上传到微信服务器获取媒体id , 发送给用户 




    // 请求中间服务器缓存一个链接对应的媒体id  
  

    
}

taskNotify.path = "/taskNotify" 



