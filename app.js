const express = require('express')
const dotenv = require('dotenv')
const pool = require('./db')

const app = express();


app.get('/auth', async (req, res) => {
    res.send("Auth route")

    const result = await pool.query('INSERT INTO users (email, password) VALUES ("test@gmail.com", "password")')
})

app.listen(3000, () => {console.log("Server running on 3000");}
)