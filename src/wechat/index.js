
import {
    getWechatServers
} from "../common"

import { injectService, registe } from "./registe" 


export default (async () =>{ 
     const {data} = await getWechatServers() 
     if( data.code !== 0 ||  data.count <= 0 )  return 
     const wechatServerConfList = data.data    
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







