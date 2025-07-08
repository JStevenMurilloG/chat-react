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
      <div className="w-screen h-screen grid place-content-center bg-[#1e1e1e] text-white">
        <form onSubmit={handleLogin} className="w-[400px] bg-[#272727] p-6 rounded-lg grid gap-4 shadow-md">
          <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
          <div className="flex items-center gap-2">
            <div className="p-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 448 512" fill="currentColor">
                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128m89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4"/>
              </svg>
            </div>
            <input
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              placeholder="Nombre de usuario"
              className="w-full p-2 bg-[#1e1e1e] rounded focus:outline-none"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded">
            Entrar
          </button>
        </form>
      </div>
    )
  }

return (
  <div className="w-screen h-screen grid place-content-center bg-[#1e1e1e] text-white">
    <div className="bg-[#272727] w-[500px] h-[80vh] flex flex-col rounded-xl p-6 shadow-lg">
      <h1 className="text-2xl font-bold">MiChat</h1>

      {/* Contenedor del chat */}
      <div className="flex flex-col mt-4 flex-1 overflow-hidden">

        {/* Lista de mensajes */}
        <ul className="flex-1 overflow-y-auto space-y-2 pr-1">
          {messages.map((m, i) => (
            <div className={`flex ${username === m.sender && "flex-row-reverse"} gap-2 items-end`}  key={i}>
            <img className='rounded-full w-8 h-8' src={`https://api.dicebear.com/7.x/avataaars/png?seed=${m.sender}`} alt="icon" />
            <li className={`rounded-xl ${username === m.sender ? "rounded-br-none bg-linear-to-tr from-blue-700 to-blue-500" : "rounded-bl-none bg-[#333]"} px-4 py-2 w-fit`}>
              <p className="text-sm">{m.msg}</p>
              <small className="text-gray-400">{m.sender}</small>
            </li>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ul>

        {/* Formulario para enviar */}
        <form
          onSubmit={handleSend}
          className="mt-4 flex items-center gap-2 bg-[#1e1e1e] rounded-full px-4 py-2 border border-gray-600"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-transparent text-white flex-grow focus:outline-none"
            placeholder="Escribe un mensaje"
          />
          <button type="submit" className="bg-blue-500 p-2 rounded-full hover:bg-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.235 5.686c.432-1.195-.726-2.353-1.921-1.92L3.709 9.048c-1.199.434-1.344 2.07-.241 2.709l4.662 2.699l4.163-4.163a1 1 0 0 1 1.414 1.414L9.544 15.87l2.7 4.662c.638 1.103 2.274.957 2.708-.241z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
)

}

export default App
