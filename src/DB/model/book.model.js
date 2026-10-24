import mongoose, { mongo } from "mongoose";

export const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        vallidate:{
            validator:function(val){
                if(val === val.toUpperCase()){
                    return false
                }
                return true
            },message:function(prop){
                return `the value ${prop.value} cann't be entirely uppercase!`
            }
        }
    },
    content:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId(),
        ref:"User",
        required:true
    }

},{
    timestamps:true,
    autoIndex:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    strict:true,
    strictQuery:true,
    collection:"Assignment08_users",
    optimisticConcurrency:true

})

export const BookModel = mongoose.models.Book || mongoose.model('Book',bookSchema)