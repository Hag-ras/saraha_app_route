import { ConflictException } from "../../common/exceptions/error.exception.js"
import { findByIdAndUpdate } from "../../common/repository/base.repository.js"
import { createLoginCredintials } from "../../common/security/token.security.js"
import { ACCESS_TOKEN_EXPIRES_IN} from "../../config.js"
import { UserModel } from "../../DB/model/user.model.js"

export const profile = async(account)=>{
    return account
}

export const update = async({id},inputs)=>{
    const account = await findByIdAndUpdate({id,update:inputs,model:UserModel
    })
    return account
}

export const rotate = async(payload,user,issuer)=>{
    const accessExpiresIn = payload.iat + ACCESS_TOKEN_EXPIRES_IN
    const currentTime = Date.now()/1000
    const differnce = accessExpiresIn-currentTime
    if(differnce>2) throw ConflictException("We can't create new token")
    
    return await createLoginCredintials({payload:{sub:user._id},issuer})
}