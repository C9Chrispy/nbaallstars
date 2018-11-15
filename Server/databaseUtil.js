const User = require('../Models/User')

function getUserFromID(userID) {
  return User.findOne({ where: { id: userID } })
}

function getAllUsers() {
  return User.findAll()
}

export {
  getUserFromID,
  getAllUsers,
}