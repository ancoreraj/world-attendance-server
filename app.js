const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')

//Importing config files
dotenv.config({ path: './config/config.env' })

//Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Running Mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
    console.log("conneted to mongo yeahh")
})
mongoose.connection.on('error', (err) => {
    console.log("err connecting", err)
})

require("./models/User");
require("./models/Class");
require("./models/Period");

//Requiring routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/class', require('./routes/class'))


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("server is running on", PORT)
})
