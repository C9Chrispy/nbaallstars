const Sequelize = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

const {
  PG_PASSWORD,
  PG_USERNAME,
  PG_DATABASE,
  PG_HOST,
} = process.env

const username = PG_USERNAME
const password = PG_PASSWORD
const database = PG_DATABASE
const host = PG_HOST

const { Op } = Sequelize

const sequelize = new Sequelize(database, username, password, {
  host,
  port: 5432,
  logging: console.log, // eslint-disable-line no-console
  maxConcurrentQueries: 100,
  dialect: 'postgres',
  dialectOptions: {
    ssl: 'Amazon RDS',
  },
  pool: { maxConnections: 5, maxIdleTime: 30 },
  language: 'en',
  operatorsAliases: {
    $and: Op.and,
    $or: Op.or,
    $eq: Op.eq,
    $gt: Op.gt,
    $lt: Op.lt,
    $lte: Op.lte,
    $like: Op.like,
  },
})

const User = sequelize.define('user', {
  id: { type: Sequelize.STRING, primaryKey: true },
  username: { type: Sequelize.STRING, unique: true },
})

// create new users

// User.sync({ force: true })

// const sean = {
//   id: 'cb5b4f23c852f675267ef22377585e48',
//   username: 'SeanPlusPlus',
// }

// const kane = {
//   id: '1a7afe5f017cbcb8412e124ac6788147',
//   username: 'Kanestapler',
// }

// User
//   .findOrCreate({ where: sean })

// User
//   .findOrCreate({ where: kane })


// User.findAll().then((response) => {
//   const users = response.map(r => _.get(r, 'dataValues', {}))
//   console.log('users', users) // eslint-disable-line no-console
//   sequelize.close()
// })

module.exports = { User, sequelize }
