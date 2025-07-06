import { DataTypes } from 'sequelize'
import { sequelize } from '../db.js'

export const Message = sequelize.define('Message', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false
  }
})
