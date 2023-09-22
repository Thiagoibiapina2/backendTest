import express from 'express'
import cors from 'cors'

import router from './routes'
import 'dotenv/config'

const app = express().use(cors())

app.use(express.json())

app.use(router)

app.listen(process.env.PORT || 3002, function () {
  console.log('Servidor Online!')
})
