const mongoose =require('mongoose');

const TeacherSchema =mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    
})
const TeacherModel =mongoose.model('teacher',TeacherSchema) //user is a collection(table) name of the DB.
module.exports =TeacherModel