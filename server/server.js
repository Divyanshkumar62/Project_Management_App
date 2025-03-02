require('dotenv').config();
const express = require('express')
const connectDB = require('./config/db')

const authRoutes = require('./routes/auth.route.js')

const app = express()

// Connecting to the database
connectDB()

// Middleware to parse data from body
app.use(express.json())

app.use('/api/auth', authRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})