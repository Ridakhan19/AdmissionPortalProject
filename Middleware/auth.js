const jwt = require('jsonwebtoken')
const UserModel = require('../MODELS/user')

    const checkUserAuth = async (req, res, next) => {
        // console.log("Hello Auth")
        const { token } = req.cookies
        // console.log(token)
        if (!token) {
            req.flash('error', 'Unauthorised user login')
            res.redirect('/')
        } else {
            const verifyLogin = jwt.verify(token, 'ridakhangwalior19')
            // console.log(verifyLogin)
            const userData = await UserModel.findOne({ _id: verifyLogin.ID })
            // console.log(userData)
            req.Udata = userData
    
            next(); //next method route to the home page
        }
    }
    module.exports = checkUserAuth