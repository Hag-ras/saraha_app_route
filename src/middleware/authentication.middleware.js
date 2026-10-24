import { tokenTypeEnum } from "../common/enum/token.enum.js"
import { UnauthorizedException } from "../common/exceptions/error.exception.js"
import { decodeToken } from "../common/security/token.security.js"

export const authentication = (tokenType= tokenTypeEnum.ACCESS)=>{
    return async(req,res,next)=>{
        const {authorization} = req.headers
        
        const [key, credential] = authorization.split(' ')
        console.log('key andd credintals', key,credential);
        
        switch (key) {
            case "Basic":
                const {email, password} = Buffer.from(credential, 'base64').toString().split[':']
                req.user = await authBasic({email, password})
                break;
            case "Bearer":
                const {account, payload} = await decodeToken({authorization:credential, tokenType})
                req.account = account
                req.payload = payload
                console.log("account and payload:",{account , payload});
                
                break;
            default:
                next(new Error("invalid auth schema",{cause:{status:400}}))
                break;
        }
        if(!authorization) throw UnauthorizedException({message:'Unauthorized account'})
        next()
}   
} 

export const authorization = (accessRole)=>{
    return async(req,res,next)=>{
        if(req.user.role < accessRole){

        }
    }
}