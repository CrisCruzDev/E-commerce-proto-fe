import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'

import productRoutes from './routes/product.route.js'
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({ limit: '50mb' })) // allows us to accept JSON data in the req.body
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use('/api/products', productRoutes)

app.listen(PORT, () => {
  connectDB()
  console.log(`Server running on port ${PORT}`)
})
