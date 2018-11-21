const serverless = require('serverless-http')
const express = require('express')
const rp = require('request-promise')
const dotenv = require('dotenv')
const _ = require('lodash')
const database = require('./util/database')
const twitter = require('./util/twitter')
const session = require('./util/session')

dotenv.config()

const {
  NODE_ENV,
  ESPN_API,
} = process.env

const app = express()

app.get('/api', (req, res) => {
  const options = {
    uri: ESPN_API,
    method: 'GET',
  }
  rp(options)
    .then((response) => {
      const json = JSON.parse(response)
      const sports = json.sports.map(s => s.slug)
      res.send({ sports })
    })
    .catch(() => {
      res.status(400)
      res.send({ message: 'error connecting to api' })
    })
})

app.get('/api/users', (req, res) => {
  database.getAllUsers().then((response) => {
    const users = response.map(r => _.get(r, 'dataValues', {}))
    console.log('users', users) // eslint-disable-line no-console
    res.send({ users })
  })
})

app.get('/twitter/request-token', (req, res) => {
  res.header({ 'Access-Control-Allow-Origin': '*' })
  twitter.getRequestToken().then((requestTokens) => {
    res.send({ requestTokens })
  }).catch((error) => {
    res.status(500)
    res.send({ message: 'Error getting request token', error })
  })
})

app.get('/twitter/access-token', (req, res) => {
  res.header({ 'Access-Control-Allow-Origin': '*' })
  const {
    authToken,
    authTokenSecret,
    authVerifier,
  } = req.query
  twitter.getAccessToken(authToken, authTokenSecret, authVerifier).then((accessData) => {
    const {
      accessToken,
      accessTokenSecret,
      userID,
    } = accessData
    const cookie = session.createUserCookie(accessToken, accessTokenSecret, userID)
    database.updateOrCreate(userID, accessToken, accessTokenSecret).then(() => {
      res.send({ cookieToStore: cookie })
    }).catch((error) => {
      res.status(500)
      res.send({ message: 'Error saving user to database', error })
    })
  }).catch((error) => {
    res.status(500)
    res.send({ message: 'Error getting access token', error })
  })
})

app.get('/twitter/get-user', (req, res) => {
  res.header({ 'Access-Control-Allow-Origin': '*' })
  const {
    userID,
    tokenHash,
  } = session.decryptUserCookie(req.query.userCookie)
  database.getUserFromID(userID).then((userData) => {
    const {
      accessToken,
      accessTokenSecret,
    } = userData.dataValues
    if (session.checkUserVerification(tokenHash, accessToken, accessTokenSecret)) {
      // eslint-disable-next-line no-console
      console.log('USER VERIFIED')
    } else {
      // eslint-disable-next-line no-console
      console.log('USER NOT VERIFIED')
    }
  })
})

if (NODE_ENV === 'development') {
  const port = 3001
  app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // eslint-disable-line no-console
}

module.exports.handler = serverless(app)
