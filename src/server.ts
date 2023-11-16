import express from 'express'
import cors from 'cors'

import router from './routes'
import 'dotenv/config'

const app = express()

const port = process.env.PORT || 3002

app.use(
  cors({
    origin: [
      'https://frontend-test-orpin.vercel.app',
      'exp://192.168.100.11:8081',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
)

app.use(express.json())

app.use(router)

app.listen(port, function () {
  console.log(`Servidor Online na porta ${port}!`)
})
