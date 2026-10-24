import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { profile, rotate, update } from "./user.service.js";
import { authentication } from "../../middleware/authentication.middleware.js";
import { tokenTypeEnum } from "../../common/enum/token.enum.js";

const router = Router()

router.get('/',authentication(), async(req, res, next)=>{
    const data = await profile(req.account)
    return successResponse({res,data})
})

router.patch('/', authentication(), async(req, res, next)=>{
    const data = await update(req.account.id, req.body)
    return successResponse({res,data})
})

router.post('/rotate-token', authentication(tokenTypeEnum.REFRESH), async(req, res, next)=>{
    const data = await rotate(req.payload, req.account,`${req.protocol}://${req.host}`)
    return successResponse({res,data})
})

export default router