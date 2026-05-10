require('dotenv').config()
const connectToDB = require('./src/config/database')
const app = require('./src/app')

connectToDB()

app.listen(5000, ()=>{
    console.log('Server is Listening on Port 5000')
})