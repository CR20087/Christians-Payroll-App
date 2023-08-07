import styled from "styled-components"
import SideBar from "../Components/Sidebar"
import {IoMdTime, IoMdHome, IoMdCalendar, IoMdCard, IoMdPerson} from "react-icons/io"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "../Components/Loading"
import Footer from "../Components/Footer"

function ManagerPortal() {

  let params = useParams()
  const [authenticated,setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {

    async function validate_auth() {
      try {
    const res = await fetch(`https://cpa-flask.azurewebsites.net/auth/validate/'${params.userID}'/${sessionStorage.getItem('authKey')}`)
    const data = await res.json()

    if (data.match === 'true') {
      setAuthenticated(true)
    }
    if (data.match === 'false') {
      setAuthenticated(false)
      if (window.location.pathname !== '/login') {
      alert("Invalid Authentication Token.\nPlease login agian.")
      navigate('/login')}
    }
      }
    catch {
      setAuthenticated(false)
      if (window.location.pathname !== '/login') {
      alert("Invalid Authentication Token.\nPlease login agian.")
      navigate('/login')}
    }
    }

    validate_auth()
  },[])

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
        <p>Small description</p>
      </Bubble>
      <Bubble to={`/Portal/manager/${params.userID}/employee-timesheets`}>
      <IoMdTime></IoMdTime>
      <h1>Timesheets</h1>
      <hr></hr>
      <p>Small description</p>
      </Bubble>
      <Bubble to={`/Portal/manager/${params.userID}/leave`}>
      <IoMdCalendar></IoMdCalendar>
      <h1>Leave</h1>
      <hr></hr>
      <p>Small description</p>
      </Bubble>
      <Bubble to={`/Portal/manager/${params.userID}/employee-view`}>
      <IoMdPerson></IoMdPerson>
      <h1>Employee Settings</h1>
      <hr></hr>
      <p>Small description</p>
      </Bubble>
    </Layout>
    </>
    : <><Loading/><Footer/></> }
    </Dashboard>
  )
}

const Dashboard = styled.div`
display:grid;
background-image: linear-gradient(45deg, transparent 20%, black 25%, transparent 25%),
                      linear-gradient(-45deg, transparent 20%, black 25%, transparent 25%),
                      linear-gradient(-45deg, transparent 75%, black 80%, transparent 0%),
                      radial-gradient(gray 2px, transparent 0);
background-size: 600px 500px, 600px 500px;
`

const Layout = styled.div`
  display: grid;
  gap: 10%;
  grid-template-columns: repeat(2, minmax(20rem, 1fr));
  justify-self: center;
  align-items: center;
`
const Bubble = styled(Link)`
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