/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-11 13:47:04 
 *  公众号常规业务
 */


export default  [
    {
        type:"text",
        handler:async acc=>{ 
            acc.send.sendTextMsg("ok") 
        }
    }
]



