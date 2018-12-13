import React, { useEffect, useState } from 'react'
import { useGlobal } from 'reactn'
import {
  Container,
  Table,
} from 'reactstrap'

// styles
import '../styles/Admin.css'
import request from '../utils/request'

// local components
import Nav from './Nav'

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateString)
}

const Admin = () => {
  const [user] = useGlobal('user')
  const [accounts, setAccounts] = useState([])
  useEffect(() => {
    request.get('/api/users').then((data) => {
      setAccounts(data.users)
    })
  }, [])
  let adminMessage
  let userTable
  if (user) {
    if (user.isAdmin) {
      // Show admin console
      adminMessage = 'You are an admin'
      userTable = accounts.map(account => (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Invited</th>
              <th>Admin</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{account.id}</th>
              <td>{account.name}</td>
              <td>{account.isInvited.toString()}</td>
              <td>{account.isAdmin.toString()}</td>
              <td>{formatDate(account.lastLogin)}</td>
            </tr>
          </tbody>
        </Table>
      ))
    } else {
      // User is not admin
      adminMessage = 'You are not an admin'
    }
  } else {
    // Not logged in
    adminMessage = 'You are not logged in'
  }
  return (
    <>
      <Nav />
      <Container id="main">
        {adminMessage}
        {userTable}
      </Container>
    </>
  )
}

export default Admin
