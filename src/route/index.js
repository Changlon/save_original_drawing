/**
 *  @author  Changlon <changlong.a2@gmail.com>
 *  @github  https://github.com/Changlon
 *  @date    2022-03-11 14:37:18 
 *  对中间服务器提供的接口
 */

import Router from "koa-router"   
import BodyParser from "koa-bodyparser" 

import {
    taskNotify,
    taskFailed,
    subscription
} from "./notify"

import {template} from "./template"

const router = new Router({prefix:"/wechatProject/api/mession/common"})  
router.use(BodyParser()) 
router.post(taskNotify.path,taskNotify)  
router.post(taskFailed.path,taskFailed)  
router.post(subscription.path,subscription)
router.post(template.path,template)
export default router 














