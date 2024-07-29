const UserModel = require('../MODELS/user')
const TeacherModel = require('../MODELS/teacher')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary')
const jwt =require('jsonwebtoken')
const CourseModel = require('../MODELS/course')
const nodemailer = require('nodemailer')
const randomstring = require('randomstring')



// Configuration
cloudinary.config({
    cloud_name: "dsbhph9id",
    api_key: "123364331599658",
    api_secret: "kEgT_5j0gUdxxfESDf7nYtCTD6o" // Click 'View Credentials' below to copy your API secret
});


class FrontController {

    static login = async (req, res) => {
        try {
            res.render("login", { message: req.flash('success'), msg: req.flash('error') })
        } catch (error) {
            console.log(error)
        }
    }
    static register = async (req, res) => {
        try {
            res.render("register", { msg: req.flash('error'),msg1:req.flash("success") })
        }
        catch (error) {
            console.log(error)
        }
    }
    static home = async (req, res) => {
        try {
            const { name, image, email, id, role} = req.Udata
            const btech = await CourseModel.findOne({ user_id: id, course: "btech" })
            const bca = await CourseModel.findOne({ user_id: id, course: "bca" })
            const mca = await CourseModel.findOne({ user_id: id, course: "mca" })
            // console.log(name)
            res.render("home", { n: name, i: image, e: email, btech: btech, bca: bca, mca: mca, role:role })
        }
        catch (error) {
            console.log(error)
        }
    }
    static about = async (req, res) => {
        try {
            const {name,image,role} = req.Udata
            //console.log(name)
            res.render("about",{n:name,i:image,role:role})
        }
        catch (error) {
            console.log(error)
        }
    }
    static contact = async (req, res) => {
        try {
            const {name,image,role} = req.Udata
            res.render("contact",{n:name,i:image,role:role})
            
        }
        catch (error) {
            console.log(error)
        }
    }


    //user insert
    static userinsert = async (req, res) => {
        try {
            //console.log("insert data")
            //console.log(req.files.image)
            const file = req.files.image
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "userimage"

            })
            //console.log(imageUpload)
            const { n, e, p, cp } = req.body
            const user = await UserModel.findOne({ email: e })
            //console.log(user)
            if (user) {
                req.flash('error', 'email already exists')
                res.redirect('/register')
            } else {
                if (n && e && p && cp) {
                    if (p == cp) {
                        const hashpassword = await bcrypt.hash(p, 10)
                        const result = new UserModel({
                            name: n,
                            email: e,
                            password: hashpassword,
                            image: {
                                public_id: imageUpload.public_id,
                                url: imageUpload.secure_url
                            }
                        })
                        const userdata = await result.save()
                        console.log(userdata)
                        if(userdata) {
                            const token = jwt.sign({ID: userdata._id}, "ridakhangwalior19");
                             //console.log(token)
                             res.cookie("token",token);
                             this.sendVerifymail(n,e,userdata._id);
                             //redirect to login page
                            req.flash(
                                "success",
                                "You Successfully Regustered! please verify your email."
                            );
                            res.redirect("/");
                        } else{
                            req.flash("/error","Not registered");
                            res.redirect("/register");
                        }

                        // req.flash('success', 'Successfully Registered Insert! Please Login')
                        // res.redirect('/') //login route path
                    } else {
                        req.flash('error', 'password and confirm password not matched')
                        res.redirect('/register') //route path

                    }

                } else {
                    req.flash('error', 'All fields are required')
                    res.redirect('/register') //route path
                }
            }





            //await result.save()
            //res.redirect('/') //route path.
        } catch (error) {
            console.log(error)
        }
    }

    //verifylogin user
    static verifyLogin = async (req, res) => {
        try {
            //console.log(req.body)
            const { email, password } = req.body
            const user = await UserModel.findOne({ email: email })
            if (user) {
                const isMatch = await bcrypt.compare(password,user.password)
                //console.log(isMatch)
                if(isMatch){

                    if(user.role == "student" && user.is_verified ==1){
                        const token = jwt.sign ({ID: user._id},"ridakhangwalior19");
                        //console.log(token)
                        res.cookie("token",token);

                        res.redirect("/home");
                    } else if (user.role =="admin" && user.is_verified == 1){
                        const token = jwt.sign({ID: user._id},"ridakhangwalior19");
                        //console.log(token)
                        res.cookie("token",token);
                        res.redirect("/home");
                    } else{
                        req.flash("error","please verify your email address");
                        res.redirect("/");
                    }
                    //token
                    //multiple login
                // if(user.role == "admin") {
                //     const token = jwt.sign({ID: user._id}, 'ridakhangwalior19');
                //     //console.log(token)
                //     res.cookie('token',token)
                //     res.redirect('/admin/display')
                // }
                // if(user.role == "student"){
                //     const token = jwt.sign({ID: user._id}, 'ridakhangwalior19');
                //     //console.log(token)
                //     res.cookie('token',token)
                //     res.redirect('/home')
                // }
                    
                    
                    
                } else{
                    req.flash("error","Email or Password not matched")
                    res.redirect('/')
                }

            } else {
                req.flash("error", "You are not registered by this Email! Please register.")
                res.redirect('/')
            }



        } catch (error) {
            console.log(error)
        }
    }

    static profile = async (req, res) => {
        try {
            const {name,image,email,role} = req.Udata
            res.render("profile",{n:name,i:image,e:email,role:role})
            
        }
        catch (error) {
            console.log(error)
        }
    }

    static changePassword = async (req, res) => {
        try {
          const { id } = req.Udata;
          //console.log(req.body)
          const { op, np, cp } = req.body;
          if (op && np && cp) {
            const user = await UserModel.findById(id);
            const isMatched = await bcrypt.compare(op, user.password);
            //console.log(isMatched)
            if (!isMatched) {
              req.flash("error", "Current password is incorrect ");
              res.redirect("/profile");
            } else {
              if (np != cp) {
                req.flash("error", "Password does not match");
                res.redirect("/profile");
              } else {
                const newHashPassword = await bcrypt.hash(np, 10);
                await UserModel.findByIdAndUpdate(id, {
                  password: newHashPassword,
                });
                req.flash("success", "Password Updated successfully ");
                res.redirect("/");
              }
            }
          } else {
            req.flash("error", "ALL fields are required ");
            res.redirect("/profile");
          }
        } catch (error) {
          console.log(error);
        }
      };

      static updateProfile = async (req, res) => {
        try {
          const { id } = req.Udata;
          const { name, email } = req.body;
          if (req.files) {
            const user = await UserModel.findById(id);
            const imageID = user.image.public_id;
            console.log(imageID);
    
            //deleting image from Cloudinary
            await cloudinary.uploader.destroy(imageID);
            //new image update
            const imagefile = req.files.image;
            const imageupload = await cloudinary.uploader.upload(
              imagefile.tempFilePath,
              {
                folder: "userprofile",
              }
            );
            var data = {
              name: name,
              email: email,
              image: {
                public_id: imageupload.public_id,
                url: imageupload.secure_url,
              },
            };
          } else {
            var data = {
              name: name,
              email: email,
            };
          }
          await UserModel.findByIdAndUpdate(id, data);
          req.flash("success", "Update Profile successfully");
          res.redirect("/profile");
        } catch (error) {
          console.log(error);
        }
      };


    

    static logout =async (req,res) => {
        try{
            res.clearCookie('token')
            res.redirect('/')
        } catch(error) {
            console.log(error)
        }
    }
    static sendVerifymail = async (name,email,user_id) => {
        //console.log(name,email,user_id);
        // connect with the smtp server.

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
            subject: ` Email Verify`, // Subject line
            text: "hello", // plain text body
            html: 
                "<p>Hii " +
                name + 
                ',please click here to <a href="http://localhost:5000/verify?id=' +
                user_id +
                    '">Verify</a>Your mail</p>',
        });
        //console.log(info);
    }

    static verifymail = async (req,res) => {
        try{
            const updateinfo =await UserModel.findByIdAndUpdate(req.query.id, {
                is_verified: 1,
            });
            if(updateinfo){
                res.redirect("/home");
            }
        } catch(error) {
            console.log(error);
        }
    }

    static forgetPasswordVerify = async (req, res) => {
        try {
          const { email } = req.body;
          const userData = await UserModel.findOne({ email: email });
          //console.log(userData)
          if (userData) {
            const randomString = randomstring.generate();
            await UserModel.updateOne(
              { email: email },
              { $set: { token: randomString } }
            );
            this.sendEmail(userData.name, userData.email, randomString);
            req.flash("success", "Plz Check Your mail to reset Your Password!");
            res.redirect("/");
          } else {
            req.flash("error", "You are not a registered Email");
            res.redirect("/");
          }
        } catch (error) {
          console.log(error);
        }
      };

      static sendEmail = async (name, email, token) => {
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
          subject: "Reset Password", // Subject line
          text: "heelo", // plain text body
          html:
            "<p>Hii " +
            name +
            ',Please click here to <a href="http://localhost:5000/reset-password?token=' +
            token +
            '">Reset</a>Your Password.',
        });
      };

      static reset_Password = async (req,res) => {
        try {
            const token = req.query.token;
            const tokenData = await UserModel.findOne({ token: token});
            if(tokenData) {
                res.render("reset-password", { user_d: tokenData._id });
            } else {
                res.render("404");
            }
        } catch (error) {
            console.log(error);
        }
    };

    static reset_Password1 = async (req,res) => {
        try {
            const {password,user_id } = req.body;
            const newHashPassword = await bcrypt.hash(password,10);
            await UserModel.findByIdAndUpdate(user_id, {
                password: newHashPassword,
                token:"",
            });
            req.flash("success","Reset Password Updated Successfully");
            res.redirect("/");
        } catch (error) {
            console.log(error);
        }
    }

    // static contact_Message = async (req,res) => {
    //     try {
    //     console.log(req.body)
    //     const { name,email,message } = req.body
    //     const result = new ContactModel({
    //         name:name,
    //         email:email,
    //         message:message
    //     })
    //     await result.save()
    //     res.redirect('/courseDisplay')
    // } 
    // catch (error) {
    //     console.log(error)
    // }
    


}
module.exports = FrontController