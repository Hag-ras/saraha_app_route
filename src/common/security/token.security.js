import jwt from 'jsonwebtoken'
import { ACCESS_ADMIN_TOKEN_SIGNATURE, ACCESS_TOKEN_EXPIRES_IN, ACCESS_USER_TOKEN_SIGNATURE, REFRESH_ADMIN_TOKEN_SIGNATURE, REFRESH_TOKEN_EXPIRES_IN, REFRESH_USER_TOKEN_SIGNATURE } from '../../config.js'
import { BadRequestException, UnauthorizedException } from '../exceptions/error.exception.js'
import { findById, findOne } from '../repository/base.repository.js'
import { UserModel } from '../../DB/model/user.model.js'
import { tokenTypeEnum } from '../enum/token.enum.js'
import { RoleEnum } from '../enum/user.enum.js'

export const createToken = async({
    payload={},
    options={},
    secret= ACCESS_USER_TOKEN_SIGNATURE
})=>{
    return jwt.sign(payload, secret,options)
}

export const verifyToken = async(
{    token="",
    secret =ACCESS_USER_TOKEN_SIGNATURE
}={})=>{
    return jwt.verify(token, secret)
}

const getTokenSignatures = async({role=RoleEnum.USER}={})=>{
    let signatures;
    switch (role) {
        case RoleEnum.ADMIN:
            signatures = {accessSignature: ACCESS_ADMIN_TOKEN_SIGNATURE, refreshSignature:REFRESH_ADMIN_TOKEN_SIGNATURE}
            break;
    
        default:
            signatures = {accessSignature: ACCESS_USER_TOKEN_SIGNATURE, refreshSignature:REFRESH_USER_TOKEN_SIGNATURE}

            break;
    }
    return signatures
}

const getSignature = async ({tokenType=tokenTypeEnum.ACCESS,role=RoleEnum.USER})=>{
    let signatures = await getTokenSignatures({role})
    return tokenType==tokenTypeEnum.ACCESS? signatures.accessSignature : signatures.refreshSignature
}

export const decodeToken = async(
{authorization="",
tokenType=tokenTypeEnum.ACCESS
}={})=>{
    const decoded= await jwt.decode(authorization)
    console.log(decoded)
    if(!decoded?.aud?.length){
        console.log("empty");
        
        throw BadRequestException("Bad request")
    }
    
    const payload = await verifyToken({
        token: authorization,
        secret: await getSignature({tokenType,role:decoded.aud[0]})})
    if(!payload){
        throw BadRequestException("Bad request")
    }

    const account = await findById({id:payload.sub,
        model:UserModel
})
    if(!account) throw UnauthorizedException({message:'Invalid account'})
    

    return {account, payload}
}

export const createLoginCredintials = async({user,
options={},issuer})=>{
const {accessSignature, refreshSignature} = await getTokenSignatures({role:user.role})
    const access_token = await createToken({
        payload:{sub: user._id},
        secret:accessSignature,
        options:{
            ...options,
            issuer,
            audience:[user.role],
             expiresIn:ACCESS_TOKEN_EXPIRES_IN}    
    })
    
    const refresh_token = await createToken({
        payload:{sub: user._id},
        secret:refreshSignature,
        options:{
            ...options,
            issuer,
            audience:[user.role],
            expiresIn:REFRESH_TOKEN_EXPIRES_IN},
    })
    console.log({accessSignature, refreshSignature})

    return {access_token, refresh_token}
}


export const authBasic = async (payload = {}) => {
    const { email, password } = payload;

    if (!email || !password) {
        throw new Error("Missing login credentials", { cause: { status: 400 } });
    }

    const account = await findOne({
        filter: { email },
        model: UserModel
    });

    if (!account) throw NotFoundException(`not exist`, { cause: { status: 404 } });

    const match = await compare(password, account.password);

    if (!match) throw NotFoundException(`not exist`, { cause: { status: 404 } });
    if (account.phone) {
        try {
            account.phone = await decryption(account.phone);
        } catch (err) {
            console.error("Failed to decrypt phone:", err.message);
        }
    }

    return account;
};