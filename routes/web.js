const express= require('express')
const FrontController =require('../CONTROLLERS/frontcontroller')
const route =express.Router()
const checkUserAuth =require ('../Middleware/auth')
const CourseController = require('../CONTROLLERS/coursecontroller')
const AdminController = require('../CONTROLLERS/AdminController')
const adminrole = require('../Middleware/adminrole')


//frontcontroller route
route.get('/',FrontController.login) //method call for login 
route.get('/register',FrontController.register) //register
route.get('/home',checkUserAuth,FrontController.home) //home
route.get('/about',checkUserAuth,FrontController.about) //about
route.get('/contact',checkUserAuth,FrontController.contact) //contact
route.get('/profile',checkUserAuth,FrontController.profile) //profile
route.post('/changePassword',checkUserAuth,FrontController.changePassword) // change profile
route.post('/updateProfile',checkUserAuth,FrontController.updateProfile) //updtae profile
route.post('/forgot_Password',FrontController.forgetPasswordVerify) // forget password
route.get('/reset-password',FrontController.reset_Password) //reset paasword




//userInsert - register route
route.post('/userInsert',FrontController.userinsert)
//verifyLogin
route.post('/verifyLogin',FrontController.verifyLogin)
//logout method - for logout
route.get('/logout',FrontController.logout)
route.get('/verify',FrontController.verifymail)




//Course
route.post('/course_insert',checkUserAuth,CourseController.courseInsert)

// course display
route.get('/courseDisplay',checkUserAuth,CourseController.courseDisplay)
route.get('/courseView/:id',checkUserAuth,CourseController.courseView)
route.get('/courseEdit/:id',checkUserAuth,CourseController.courseEdit)
route.post('/courseUpdate/:id',checkUserAuth,CourseController.courseUpdate)
route.get('/courseDelete/:id',checkUserAuth,CourseController.courseDelete)

//admin controller
route.get('/admin/display',checkUserAuth,adminrole('admin'),AdminController.display)

//update status
route.post('/admin/updateStatus/:id',checkUserAuth,adminrole('admin'),AdminController.updateStatus)

//admin course delete 
route.get('/admin/courseDelete/:id',checkUserAuth,AdminController.courseDelete)


module.exports =route