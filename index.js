require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const { noteRouter } = require('./routes/noteRoute')
const { userRouter } = require('./routes/userRoute')
const app = express()

//bodyparser / middleware

app.use(helmet())
app.use(require('cors')())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended:true}));
app.use(morgan('dev'))

app.use('/api/v1/note',noteRouter)
app.use('/api/v1/user',userRouter)

//server start
app.listen(8080,()=>{console.log("Server Started on Port 8080");})

// AARTI SANGRAHA