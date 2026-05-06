const mongoose = require('mongoose')

const connectToDB = async (req,res) =>{
    await mongoose.connect(process.env.MONGO_URI)
    console.log('connected to Database')
}

module.exports = connectToDB