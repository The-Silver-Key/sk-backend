const express = require('express')
const dotenv = require('dotenv')
const pool = require('./db')
const authRoute = require('./routes/authRoute')
const walletRoute = require('./routes/walletRoute')
const userRoute = require('./routes/userRoute')

const app = express();

app.use(express.json())

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