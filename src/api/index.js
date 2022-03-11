import conf from "./api.config" 
import axios from "axios" 

const env = process.env.NODE_ENV 
const {dev,pro} = conf 
const {domain,port} = env.startsWith("dev") ?  dev : pro  
const baseURL = `${domain.startsWith("http")? domain : "http://" + domain}${port?":"+port:""}/api/wechat/common` 

const request = axios.create({
    baseURL,
    timeout:conf.timeout,
    headers:{
        auth:"INS-WECHAT-SERVER"  
    }
})

export default request  





 



