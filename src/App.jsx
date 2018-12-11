import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// bootstrap styles
import 'bootstrap/dist/css/bootstrap.min.css'

// local components
import Refresh from './components/Refresh'
import Main from './components/Main'
import Login from './components/Login'
import Profile from './components/Profile'

const App = () => (
  <Router>
    <>
      <Refresh />
      <Route path="/" exact component={Main} />
      <Route path="/login" exact component={Login} />
      <Route path="/profile" exact component={Profile} />
    </>
  </Router>
)

export default App
