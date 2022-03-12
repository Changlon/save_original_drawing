import { expect } from "chai"
import { it } from "mocha"
import {
    getWechatServers
} from "../src/common"


import {
    isValidResponse 
} from "../build/common_valid"

describe("接口测试",()=>{
    describe("公众号接口测试",()=>{

        it("获取公众号配置参数",(done)=>{
            getWechatServers().then(resCode=>{ 
                expect(isValidResponse(resCode)).to.be.true  
                const data = resCode.data.data 
                expect( (data instanceof Array && data.length >0 )).to.be.true 
                done()
            })
        })
    })

    

})


