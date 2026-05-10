const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRouter = require('../src/routes/auth')
const formRouter = require('../src/routes/forms')
const deptRouter = require('../src/routes/department')
const adminRouter = require('../src/routes/admin')


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use('/api/auth' , authRouter)
app.use('/api/forms', formRouter)
app.use('/api/departments', deptRouter)
app.use('/api/admin', adminRouter)

module.exports = app