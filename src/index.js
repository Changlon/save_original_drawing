import Koa from "koa"  
import Router from "koa-router" 
import KoaXmlParser from "koa-xml-body" 
import  wechats from "./wechat" 
import  commonRouter from "./route"  

(async()=>{
   const app = new Koa()  
   const wechatRouter = new Router({prefix:"/wechat"})
   const wechatMap =  await wechats()  

    //将wechatMap 配置到路由上
   app.use(async (ctx,next)=>{
        ctx.wechatMap = wechatMap 
        await  next() 
   })

   //开启公众号接入
   const wechatIter = wechatMap.values() 
   while(1) {
       const {value :wechatApp ,done} = wechatIter.next()   
       if(done) break 
       wechatRouter.all(wechatApp.opt.route,wechatApp.start())
   }

   app.use(KoaXmlParser())
   app.use(wechatRouter.routes())
   app.use(commonRouter.routes())  
   app.listen(3000,()=>{
       console.log("wechat servers listen on port 3000!")
   }) 

})()







