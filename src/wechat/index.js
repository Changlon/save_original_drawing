
import {
    getWechatServers
} from "../common"

import { injectService, registe } from "./registe" 


export default (async () =>{ 
     const {data,code,count} = await getWechatServers() 
     if( code !== 0 ||  count <= 0 )  return 
     const wechatServerConfList = data   
     const wechatMap = new Map()  
     for(let wechatServerConf of wechatServerConfList) {
         const wechatApp = registe(wechatServerConf) 
         if(wechatApp){
            injectService(wechatApp)    
            wechatMap.set(wechatServerConf.wechatId,wechatApp) 
         } 
     }
     return wechatMap
})







