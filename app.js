const express= require('express')
const app= express()
const port= 5000
const web= require('./routes/web')
const connectDB =require('./database/connectDB')


//connect flash and sessions
const session = require('express-session')
const flash = require('connect-flash');
const fileUpload =require('express-fileupload')
const cookieParser = require('cookie-parser')

//token get cookie
app.use(cookieParser())

app.use(fileUpload({
 useTempFiles : true,
  tempFileDir : '/tmp/'
}));


//messages
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));
//Flash messages
app.use(flash());

//parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false}))

//ejs set  for html  and css
app.set('view engine','ejs')

//CSS image link
app.use(express.static('public'))

//connect db
connectDB()


//https://localhost:5000/
//route load
app.use('/',web)

 //server create
app.listen(port,()=>console.log("server start localhost: 5000"))