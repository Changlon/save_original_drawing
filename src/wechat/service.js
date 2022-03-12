/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-11 13:47:04 
 *  公众号常规业务
 */


export default  [
    {
        type:"text",
        pattern:"test", 
        wechatId:"gh_170e65c7bd09",
        handler:async acc=>{ 
            acc.send.sendTxtMsg("完成")
        }

    }
]



