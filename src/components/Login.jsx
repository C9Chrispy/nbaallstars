import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import * as QueryString from 'query-string'
import {
  Container, Button,
  Label, Input,
  Alert,
} from 'reactstrap'

// styles
import '../styles/Login.css'

// local components
import Nav from './Nav'
import Auth from '../utils/auth'

function getUserToken(oauth_token, oauth_verifier) {
  return Auth.getUserTokens(oauth_token, oauth_verifier)
}

const Login = (props) => {
  const [passcode, setPasscode] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  useEffect(() => {
    const {
      location,
      history,
    } = props
    const queryParams = QueryString.parse(location.search)
    const {
      oauth_token,
      oauth_verifier,
    } = queryParams
    if (oauth_token && oauth_verifier) {
      getUserToken(oauth_token, oauth_verifier).then(() => {
        history.push('/login')
      })
    }
  })

  function dismissAlerts() {
    setSuccess(false)
    setError(false)
  }

  function onSubmit() {
    dismissAlerts()
    Auth.addUser(passcode).then((data) => {
      if (data.message === 'Success') {
        setSuccess(true)
      } else {
        setError(true)
      }
    })
  }

  return (
    <>
      <Nav />
      <Container id="main">
        <Label for="passcode-input">Passcode</Label>
        <Input
          type="text"
          name="passcode"
          id="passcode-input"
          value={passcode}
          placeholder="Enter Passcode"
          onChange={e => setPasscode(e.target.value)}
        />
        <Button onClick={onSubmit}>Submit</Button>
        <Alert className="alert-position" color="success" isOpen={success} toggle={dismissAlerts}>
          Success! You have been granted access to play NBA All Stars Fantasy
        </Alert>
        <Alert className="alert-position" color="danger" isOpen={error} toggle={dismissAlerts}>
          Incorrect Passcode
        </Alert>
      </Container>
    </>
  )
}

Login.propTypes = {
  // This props are included by default by React. Not sure why ESLint throws this error.
  // Worried that if I add them in defaultProps it could create errors.
  // eslint-disable-next-line react/require-default-props
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  // eslint-disable-next-line react/require-default-props
  history: PropTypes.shape({}),
}


export default Login
