import conf from "./api.config" 
import generateReqAny from "request-any"
import { getSign } from "../wechat/utils"
import fs from "fs"
const env = process.env.NODE_ENV 
const {dev,pro} = conf 
const {domain,port,base} = env.startsWith("dev") ?  dev : pro  
const baseURL = `${domain.startsWith("http")? domain : "http://" + domain}${port?":"+port:""}${base? `\\${base}`: ""}/api/wechat/common` 

export default generateReqAny({
    reqUrl:baseURL,
    beforeRequest(data,headers) { 
        console.log(`==========================REQUEST==============================`)
        console.log("==========================HEADERS==============================")
        headers["Sign"] = getSign()
        console.debug(headers)
        console.log("===========================DATA================================") 
        console.debug(data)
        console.log("===============================================================")
    },
    timeout:conf.timeout,
    debug:true
})


