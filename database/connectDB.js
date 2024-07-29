const mongoose = require('mongoose');
const local_URL = ('mongodb://127.0.0.1:27017/admission_Portal');
const live_URL = 'mongodb+srv://Rida:rida1999@cluster0.fgrfdmz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const connectDB = () => {
    return mongoose.connect(live_URL)
        .then(() => {
            console.log('Connect Successfully')
        }).catch((error) => {
            console.log(error)

        })

}
module.exports = connectDB