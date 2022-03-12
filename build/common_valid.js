/**
 * 验证请求返回
 * @param {*} res 
 * @returns 
 */
 export function isValidResponse(res) {
    if(res.status === undefined) return false 
    if(res.statusText === undefined) return false 
    if(res.data === undefined) return false 
    return true 
}