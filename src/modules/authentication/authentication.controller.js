import {Router} from 'express'
import { signup, login } from './authentication.service.js'
import { successResponse } from '../../common/utils/succuess.response.js'

const router = Router()

router.post('/signup', async (req, res, next)=>{
    const data = await signup(req.body)
    return successResponse({res,status:201,message:"account created successfully!",data})
})

router.post('/login', async(req, res, next)=>{
    const data = await login(req.body,`${req.protocol}://${req.host}`)

    return res.status(200).json({message: "Done", data})
})

export default router