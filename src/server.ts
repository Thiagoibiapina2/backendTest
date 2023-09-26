import express from 'express'
import cors from 'cors'

import router from './routes'
import 'dotenv/config'

const app = express()

const port = process.env.PORT || 3002

app.use(
  cors({
    origin: 'http://localhost:3000', // Substitua isso pela origem da sua aplicação web
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Se você estiver usando cookies ou autenticação com credenciais
  }),
)

app.use(express.json())

app.use(router)

app.listen(port, function () {
  console.log('Servidor Online!')
})
