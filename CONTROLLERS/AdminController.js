const CourseModel = require('../MODELS/course')
const nodemailer = require('nodemailer')

class AdminController{
    static display = async(req,res )=>{
        try{
            const {name,email,image,id,role} = req.Udata
            const course = await CourseModel.find()
            res.render('admin/display',{c:course,n:name,i:image,role:role,msg:req.flash('success')})
        } catch(error){
            console.log(error)
        }
    }

    static updateStatus = async(req,res )=>{
        try{
            //console.log(req.body)
            const {name,email,status,comment,course} = req.body
            const update = await CourseModel.findByIdAndUpdate(req.params.id,{
                status:status,
                comment:comment
            })
            this.sendEmail(name,email,status,comment,course)
            req.flash("success","Status Update Successfully")
            res.redirect('/admin/display')
        } catch(error){
            console.log(error)
        }
    }
    static sendEmail = async (name, email,course,status,comment) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "rida.19k@gmail.com",
                pass: "ulbybmyxqozwiohk",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: `${course} Course ${status}`, // Subject line
            text: "hello", // plain text body
            html: `<b>${name}</b> ${course} Course <b>${status}</b> Course Successfully Inserted! <br>
            <b>Comment from Admin</b> ${comment}`, //html body
        });
    }
    

    
    static courseDelete = async (req, res) => {
        try {
            const { name, image, id } = req.Udata
            await CourseModel.findByIdAndDelete(req.params.id)
            res.redirect('/admin/display')

        }
        catch (error) {
            console.log(error)
        }
    }


    
}
module.exports =AdminController