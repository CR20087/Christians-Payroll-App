import styled from "styled-components"
import SideBar from "../Components/Sidebar"
import {IoMdTime, IoMdCalendar, IoMdCard, IoMdPerson} from "react-icons/io"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "../Components/Loading"
import Footer from "../Components/Footer"
import Cookies from 'js-cookie';

function ManagerPortal() {

  let params = useParams()
  const [authenticated,setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {

    //Authentication Process

    async function validate_auth() {
      try {
        const auth_key = Cookies.get('auth_key');
    const res = await fetch(`https://cpa-flask.azurewebsites.net/protected/resource`, {
      method: 'POST', // Use POST method
      body: JSON.stringify({ username: params.userID, auth_key: auth_key}),
      headers: {
          'Content-Type': 'application/json'
      }
  })
    const data = await res.json()
    if (data.status === 'True') {
      setAuthenticated(true)
    }
    if (data.status === 'False') {
      setAuthenticated(false)
      if (window.location.pathname !== '/login') {
      alert("Invalid Authentication Token.\nPlease login again.")
      navigate('/login')}
    }
      }
    catch {
      setAuthenticated(false)
      if (window.location.pathname !== '/login') {
      alert("Invalid Authentication Token.\nPlease login again.")
      navigate('/login')}
    }
    }

    validate_auth()
  },[])

  //Page

  return (
    <Dashboard>
      {authenticated ?
            <>
    <SideBar/>
    <Layout>
      <Bubble to={`/Portal/manager/${params.userID}/pay-run`}>
        <IoMdCard></IoMdCard>
        <h1>Pay Run</h1>
        <hr></hr>
        <p>View the Projected next Payrun Or View past employee payruns that are yet to be paid
          <br></br>Either Pay all employees or Select employees
        </p>
      </Bubble>
      <Bubble to={`/Portal/manager/${params.userID}/employee-timesheets`}>
      <IoMdTime></IoMdTime>
      <h1>Timesheets</h1>
      <hr></hr>
      <p>View and track active employee timesheets</p>
      </Bubble>
      <Bubble to={`/Portal/manager/${params.userID}/leave`}>
      <IoMdCalendar></IoMdCalendar>
      <h1>Leave</h1>
      <hr></hr>
      <p>View and Manage current/upcoming leave requests
        <br></br>Accept or Decline requests
      </p>
      </Bubble>
      <Bubble to={`/Portal/manager/${params.userID}/employee-view`}>
      <IoMdPerson></IoMdPerson>
      <h1>Employee Settings</h1>
      <hr></hr>
      <p>View and Manage employee accounts
        <br></br>Add new accounts, edit current accounts
        </p>
      </Bubble>
    </Layout>
    </>
    : <><Loading/><Footer/></> }
    </Dashboard>
  )
}

//Styling

const Dashboard = styled.div`
display:grid;
background-image: linear-gradient(45deg, transparent 20%, black 25%, transparent 25%),
                      linear-gradient(-45deg, transparent 20%, black 25%, transparent 25%),
                      linear-gradient(-45deg, transparent 75%, black 80%, transparent 0%),
                      radial-gradient(gray 2px, transparent 0);` //Background pattern

const Layout = styled.div`
  display: grid;
  gap: 10%;
  grid-template-columns: repeat(2, minmax(20rem, 1fr));
  justify-self: center;
  align-items: center;
  height: 80%;
  align-self: center;
`
const Bubble = styled(Link)` //'Bubbles' are used as shortcuts to pages
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
text-decoration: none;
color: #00060b;
height: 37vh;
width: 37vw;
align-items: center;
max-width: 53vh;
border-radius: 30px;
background: #a6b8c7;
text-align: center;

hr {
  width: 80%;
}

svg {
  height: 50px;
  width: 50px;
  color: #003b6f
}
`

export default ManagerPortal