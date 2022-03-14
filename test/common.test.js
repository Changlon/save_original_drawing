import { expect } from "chai"
import { it } from "mocha" 

import {
    getWechatServers,
    userSub,
    userUnSub
} from "../src/common"



import {
    isValidResponse ,
    isNotNullData
} from "../build/common_valid"

describe("接口测试",()=>{

    describe("公众号接口测试",()=>{
        it("获取公众号配置参数",done =>{ 
            getWechatServers().then(res=>{
                    expect(isValidResponse(res) && isNotNullData(res)).to.be.true  
                    done()
            })
        })
    })

    describe("用户模块接口测试",()=>{

        it("用户关注公众号",done =>{
            userSub({
                openid:"testOpenid",
                unionid:"testUnionId",
                wechatid:"testWechatId",
                nickname:"testName",
                headimgurl:"testHeadImgUrl",
                sex:1,
                language:"zh_cn",
                city:"testCity",
                country:"testCountry",
                province:"testProvince"
            }).then(res =>{
                const v = isValidResponse(res)  &&  (res.data.code == 0 || res.data.code == 1) && (res.data.msg == "ok" || res.data.msg == "exist")
                expect(v).to.be.true 
                done()
            })
        }) 

        it("用户取消关注公众号",done=>{ 
            userUnSub("testOpenid").then(res=>{
                const v = isValidResponse(res) && (res.data.code == 0)  && (res.data.msg =="成功")
                expect(v).to.be.true 
                done()
            })
        })


    })
    

})


