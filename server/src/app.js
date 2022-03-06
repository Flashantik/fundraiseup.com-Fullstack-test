import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import { environment } from '../config.js'
import donate from './routes/donate.route.js'

const env = process.env.NODE_ENV || 'development'
const app = express()

const mongoDB = process.env.MONGODB_URI || environment[env].dbString
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected')
  })
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.get('/', (req, res) => {
  console.log('Apollo GraphQL Express server is ready')
})

app.use('/donate', donate)

app.listen({ port: environment[env].port }, () => {
  console.log(`Server is running at http://localhost:8080`)
})
