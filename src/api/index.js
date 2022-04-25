import conf from "./api.config" 
import generateReqAny from "request-any"
import { getSign } from "../wechat/utils"

const env = process.env.NODE_ENV 
const {dev,pro} = conf 
const {domain,port} = env.startsWith("dev") ?  dev : pro  
const baseURL = `${domain.startsWith("http")? domain : "http://" + domain}${port?":"+port:""}/api/wechat/common` 

export default generateReqAny({
    reqUrl:baseURL,
    beforeRequest(data,headers) {
        headers["Sign"] = getSign()
    },
    timeout:conf.timeout
})


