/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-11 14:37:18 
 *  对中间服务器提供的接口
 */

import Router from "koa-router"   
const router = new Router({prefix:"/api/mession/common"})  

router.get("/test",(ctx)=>{ 
    console.log(ctx.wehcatMap)
})


export default router 














