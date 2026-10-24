import mongoose from "mongoose";
import { GenderEnum, RoleEnum } from "../../common/enum/user.enum.js";

export const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:16,
        max:60
    },
    gender:{
        type:Number,
        enum:Object.values(GenderEnum),
        default:GenderEnum.MALE
    },
    role:{
        type:Number,
        default:RoleEnum.USER,
        enum:Object.values(RoleEnum )
    }
},
{
    timestamps:true,
    autoIndex:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    strict:true,
    strictQuery:true,
    collection:"users",
    optimisticConcurrency:true
})

export const UserModel = mongoose.models.User || mongoose.model("User",userSchema)