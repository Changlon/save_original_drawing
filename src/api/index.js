import conf from "./api.config" 
import axios from "axios" 
import qs from "qs"

const env = process.env.NODE_ENV 
const {dev,pro} = conf 
const {domain,port} = env.startsWith("dev") ?  dev : pro  
const baseURL = `${domain.startsWith("http")? domain : "http://" + domain}${port?":"+port:""}/api/h5/common` 

export const request = axios.create({
    baseURL,
    timeout:conf.timeout,
    headers:{
        auth:"INS-WECHAT-SERVER"  
    }
})

export default  async (route ,data = {},type = "get", json =false ) => { 
    type = type.toLowerCase()   
    if(type === "get" || type === "delete" || type === "del") {
        type = type === "del" ?  "delete" :type 
        return await request[type](route,{
            headers:{
                "Content-Type": json? "application/json" :"application/x-www-form-urlencoded"
            },
            data: json ? JSON.stringify(data) : qs.stringify(data)
        })

    }else if(type === "put" || type === "post") {
        return await request[type](route,json ? JSON.stringify(data) : qs.stringify(data),{
            headers:{
                "Content-Type": json? "application/json" :"application/x-www-form-urlencoded"
            } 
        })
    }else{ 
        throw new Error("不支持其他请求!")
    }
    
}   




 



