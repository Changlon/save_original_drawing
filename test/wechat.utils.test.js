
import { expect } from "chai"
import { it } from "mocha" 
import path from "path"

import {
    parseInsLink ,
    sendMediaMsg , 
    pushTxtCustomerMsgBatch,
    uploadLocalFilesToWx
} from "../src/wechat/utils"


import wechatPub from "koa-wechat-public" 

describe("测试公众号utils",()=>{  

    const wechatApp = new wechatPub({
        appId:"wx3ace0c0fa2f4cab0",
        appSecret:"8ea32e13460637765fb65a5e48b7c023",
        token:"changlon"
    })
    
    let openid = "oOskj6NqnCG1C1eBSh0cz6H7GEZE"


    describe("测试uploadLocalFilesToWx函数",()=>{

        it("可以批量上传本地文件到微信公众号素材库",done =>{

            (async ()=>{

                const file_path = path.resolve(__dirname,"./resource/image.png")
                
                const fileList = [
                    {
                        file_path ,
                        file_type: "image"

                    },

                    {
                        file_path ,
                        file_type: "image"

                    }
                ]

                const medias = await uploadLocalFilesToWx({wechatApp,fileList})

                expect(medias.length).to.equal(fileList.length)

                done()

            })()
        })
    })


    describe("测试pushTxtCustomerMsgBatch函数",()=>{
        it("可以成功批量发送消息", done =>{ 

            (async ()=>{
                const msgList = [
                    "msg1",
                    "msg2",
                    "msg3"
                ]
               const successNum = await pushTxtCustomerMsgBatch({wechatApp,openid,msgList}) 
               expect(successNum).equal(msgList.length)
               done()
            })()

        })
    })

    describe("测试sendMediaMsg函数", ()=>{  
        let thumb_media_id
        it("参数不正确应该返回 undefined ", done =>{
            (async()=>{
                let res = await sendMediaMsg({wechatApp:{},openid:"xxx",media:[]}) 
                expect(res).to.be.undefined 
                done()
            })() 
        })

        it("可以发送图片媒体消息",done =>{
            (async()=>{
                let filepath =  path.join(__dirname,"/resource/image.png") 
                let media = await wechatApp.addTmpMaterial(filepath,"image") 
                thumb_media_id = media.media_id 
                let res = await sendMediaMsg({wechatApp,openid,media}) 
                expect(res).equal(1)  
                done()
            })()
        })

        it("可以发送视频媒体消息",done =>{ 
            (async()=>{
                let filepath =  path.join(__dirname,"/resource/video.mp4") 
                let media = await wechatApp.addTmpMaterial(filepath,"video")   
                media.thumb_media_id = thumb_media_id        
                let res = await sendMediaMsg({wechatApp,openid,media})   
                expect(res).equal(1)  
                done()
            })()
        })
        
    })

    describe("测试parseInsLink函数",()=>{

        it("可以识别instagram链接",()=>{ 
            expect(parseInsLink(1)).to.be.undefined 
            expect(parseInsLink("https://www.baidu.com")).to.be.undefined 
            expect(parseInsLink({})).to.be.undefined  
            
            // 1. 帖子链接 
           let  result 
           result = parseInsLink("https://instagram.com/p/CJ0VfRFj76Z/?utm_medium=copy_link")  
           expect(result.link).equal("https://instagram.com/p/CJ0VfRFj76Z/?__a=1") 
           expect(result.type).equal("p") 
           expect(result.shortcode).equal("CJ0VfRFj76Z") 

           result = parseInsLink("http://www.instagram.com/p/BggYTj3l9ms/?utm_medium=copy_link")  
           expect(result.link).equal("http://www.instagram.com/p/BggYTj3l9ms/?__a=1") 
           expect(result.type).equal("p") 
           expect(result.shortcode).equal("BggYTj3l9ms") 

           result = parseInsLink("https://www.instagram.com/e_lludda/p/CY9LYlbBCTc/?utm_medium=copy_link") 
           expect(result.link).equal("https://www.instagram.com/e_lludda/p/CY9LYlbBCTc/?__a=1") 
           expect(result.type).equal("p") 
           expect(result.shortcode).equal("CY9LYlbBCTc") 
           expect(result.username).equal("e_lludda")

            
           result = parseInsLink("https://www.instagram.com/p/pm_u28S7Hg/?utm_medium=copy_link") 
           expect(result.link).equal("https://www.instagram.com/p/pm_u28S7Hg/?__a=1") 
           expect(result.type).equal("p") 
           expect(result.shortcode).equal("pm_u28S7Hg") 
           
           result = parseInsLink("https://www.instagram.com/reel/CYa5TAGvG3S/?utm_medium=copy_link")

           expect(result.link).equal("https://www.instagram.com/reel/CYa5TAGvG3S/?__a=1") 
           expect(result.type).equal("reel") 
           expect(result.shortcode).equal("CYa5TAGvG3S") 
          
           // 2. tv链接 
          
           result = parseInsLink("https://www.instagram.com/perkinizer/tv/CZL5dVFooPq/?utm_medium=copy_link") 
           expect(result.link).equal("https://www.instagram.com/perkinizer/tv/CZL5dVFooPq/?__a=1") 
           expect(result.type).equal("tv") 
           expect(result.shortcode).equal("CZL5dVFooPq") 
           expect(result.username).equal("perkinizer")

           //3.主页链接 
           result = parseInsLink("https://www.instagram.com/thv/") 
           expect(result.link).equal("https://www.instagram.com/thv/?__a=1") 
           expect(result.type).equal("profile") 
           expect(result.username).equal("thv")

        })
    })

})