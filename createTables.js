const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false
});


const Users = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isVip: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  follow: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  followers: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  }
});

(async () => {
  // Sync database and create tables
  await sequelize.sync();
  console.log('Database & tables created!');
})();

module.exports = { Users }