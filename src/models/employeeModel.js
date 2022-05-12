const mongoose=require('mongoose')
const validator=require('validator');

const emploSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        unique: true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not a valid email',
            isAsync:false
        }
    },
    password:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    isdelete:{
        type:boolean,
        default:false,
        deletedAt:null
        
    }
}, {timestamps: true} )



module.exports=mongoose.model("Employee",emploSchema)  


