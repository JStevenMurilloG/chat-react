Este proyecto es una aplicación de chat en tiempo real que utiliza:

- **React + Vite** para el frontend.
- **Node.js + Express** para el backend.
- **Socket.IO** para comunicación en tiempo real.
- **Sequelize ORM + MySQL** para la persistencia de mensajes.

---

## 📁 Estructura del Proyecto
├── client/ # Frontend en React
├── server/ # Backend en Node.js
├── server/models/ # Modelos Sequelize
├── server/.env # Variables de entorno
└── README.md

## ✅ Requisitos Previos

- Node.js 20.x (Usa `nvm` si necesitas múltiples versiones)
- MySQL (corriendo en tu máquina o en un servidor local/remoto)
- NPM (ya viene con Node.js)

---

## 📦 Instalación de Dependencias

### 1. Clonar el proyecto

bash
git clone https://github.com/JStevenMurilloG/chat-react
cd chat-react

### 2. Instalar dependencias del backend
cd server
npm install

### 3. Instalar dependencias del frontend
cd ../client
npm install

## Configuración de la Base de Datos
Abre tu gestor MySQL y crea una base de datos llamada:

En la raíz del proyecto, crea un archivo .env con las variables de entorno:
MYSQL_DATABASE=chatdb
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_HOST=localhost
PORT=3000

Sequelize se encargará automáticamente de crear la tabla messages cuando el servidor se inicie.

## 🚀 Ejecución del Proyecto
### 1. Iniciar el servidor
cd server
npm run dev

### 2. Iniciar la app de React
Abre otra terminal y ejecuta
cd client
npm run dev


## 🧪 Cómo Probar el Chat
Abre http://localhost:5173 en dos pestañas distintas o en navegadores diferentes.

Ingresa nombres de usuario distintos.

Comienza a chatear. Verás los mensajes en tiempo real en ambas ventanas.

