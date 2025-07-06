import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', { autoConnect: false })

function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [inputUsername, setInputUsername] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (username) {
      socket.auth = { username, serverOffset: 0 }
      socket.connect()
    }

    return () => {
      socket.disconnect()
    }
  }, [username])

  useEffect(() => {
    socket.on('chat message', (msg, id, sender) => {
      setMessages(prev => [...prev, { msg, id, sender }])
      socket.auth.serverOffset = id
    })

    return () => {
      socket.off('chat message')
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleLogin = (e) => {
    e.preventDefault()
    if (!inputUsername.trim()) return
    localStorage.setItem('username', inputUsername)
    setUsername(inputUsername)
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (message.trim()) {
      socket.emit('chat message', message)
      setMessage('')
    }
  }

  if (!username) {
    return (
      <form onSubmit={handleLogin} style={{ padding: 20 }}>
        <label>Nombre de usuario:</label>
        <input
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    )
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {messages.map((m, i) => (
          <li key={i} style={{ background: i % 2 ? '#eee' : '#ccc', padding: 8 }}>
            <p>{m.msg}</p>
            <small>{m.sender}</small>
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>

      <form onSubmit={handleSend} style={{ display: 'flex', marginTop: 12 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1, marginRight: 8 }}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  )
}

export default App

