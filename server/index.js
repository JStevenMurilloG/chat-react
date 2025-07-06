// server/index.js
import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { sequelize } from './db.js'
import { Message } from './models/Message.js'
import { Op } from 'sequelize'

dotenv.config()

const port = process.env.PORT || 3000

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}))

app.use(logger('dev'))

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  },
  connectionStateRecovery: {}
})

// Conexión y sincronización con MySQL
try {
  await sequelize.authenticate()
  await Message.sync() // Crea la tabla si no existe
  console.log('MySQL DB connected')
} catch (error) {
  console.error('Error connecting to MySQL:', error)
}

io.on('connection', async (socket) => {
  console.log('a user has connected!')

  socket.on('disconnect', () => {
    console.log('a user has disconnected')
  })

  socket.on('chat message', async (msg) => {
    const username = socket.handshake.auth.username ?? 'anonymous'

    try {
      const message = await Message.create({ content: msg, user: username })
      io.emit('chat message', msg, message.id.toString(), username)
    } catch (e) {
      console.error(e)
    }
  })

  if (!socket.recovered) {
    try {
      const lastId = socket.handshake.auth.serverOffset ?? 0
      const messages = await Message.findAll({
        where: { id: { [Op.gt]: lastId } }
      })

      messages.forEach(({ content, id, user }) => {
        socket.emit('chat message', content, id.toString(), user)
      })
    } catch (e) {
      console.error(e)
    }
  }
})

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
