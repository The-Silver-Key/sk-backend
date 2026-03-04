const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const pool = require('./db')
const authRoute = require('./routes/authRoute')
const walletRoute = require('./routes/walletRoute')
const userRoute = require('./routes/userRoute')

const app = express();

app.use(express.json())

const allowedOrigins = [
    'http://localhost:3000',
    'https://thesilverkey.lovable.app'
]

app.use(cors({
    origin: (origin, callback) => {
        if(!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}))

app.use('/auth', authRoute)
app.use('/wallet', walletRoute)
app.use('/users', userRoute)

app.post('/wallet/add', async (req, res) => {
    res.send("Wallet route")

})

app.post('/wallet/delete', async (req, res) => {
    res.send("Wallet delete route")
})

app.all('*path', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Cannot find path ${req.originalUrl} in this server`
    });
})

//app.use(globalErrorHandler);
//app.use

app.listen(3000, () => console.log("Server running on 3000")
)