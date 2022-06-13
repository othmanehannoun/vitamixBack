const express = require('express')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const helmet = require("helmet")
var cors = require('cors')
var cookieParser = require('cookie-parser')

// Import route
const usersRouter = require('./routes/users')
const emailRouter = require('./routes/mail')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const subcategoryRouter = require('./routes/subCategory')
const orderRouter = require('./routes/order')

// config app
require('dotenv').config()
const app = express()

app.use(cors())

// connection to database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    tlsAllowInvalidHostnames: true,
    tlsAllowInvalidCertificates: true,
})
.then(() => console.log('connected to database'))
.catch(() => console.log('database is not connected'))

// test app
app.get('/', (req, res) => {
    res.send("welcome to vitamix server api")
})

// middllwares
app.use('/public', express.static('./public'));
app.use(express.json())
app.use(expressValidator())
app.use(cookieParser())

// secret your app
app.use(helmet());

// routes middllwares
app.use('/api/user', usersRouter)
app.use('/api/emails', emailRouter)
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)
app.use('/api/subcategory', subcategoryRouter)
app.use('/api/order', orderRouter)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`app is now listening at port ${port}`))
