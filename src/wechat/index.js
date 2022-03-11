
import {
    getWechatServers
} from "../common"

import { registe } from "./registe" 


export default (async () =>{ 
     const {data} = await getWechatServers() 
     if( data.code !== 0 ||  data.count <= 0 )  return 
     const wechatServerConfList = data.data  
     const wechatMap = new Map()  
     for(let wechatServerConf of wechatServerConfList) {
         const wechatApp = registe(wechatServerConf) 


         //TODO 增加逻辑业务 
         

        

         if(wechatApp) wechatMap.set(wechatServerConf.wechatId,wechatApp) 
     }
     return wechatMap
})







