/**
 * 验证是一个请求
 * @param {*} res 
 * @returns 
 */
 export function isValidResponse(res) {
    if(res.status === undefined) return false 
    if(res.statusText === undefined) return false 
    return true 
}



/**
 * 请求返回的data数据不为空
 * @param {*} res 
 */
export function isNotNullData(res) { 
    if(res.data.data) return true 
    return false 
}


