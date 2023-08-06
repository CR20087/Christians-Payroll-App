import styled from "styled-components"
import SideBar from "../Components/Sidebar"
import {IoMdTime, IoMdSettings, IoMdCalendar } from "react-icons/io"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "../Components/Loading"
import Footer from "../Components/Footer"

function EmployeePortal() {

  let params = useParams()
  const [authenticated,setAuthenticated] = useState(false)

  useEffect(() => {

    async function validate_auth() {
    console.log('validate')

    const res = await fetch(`https://cpa-flask.azurewebsites.net/auth/validate/'${params.userID}'/${sessionStorage.getItem('authKey')}`)
    const data = await res.json()

    console.log(data)

    if (data.match === 'true') {
      setAuthenticated(true)
    }
    if (data.match === 'false') {
      setAuthenticated(false)
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
      <Bubble to={`/Portal/employee/${params.userID}/timesheets`}>
      <IoMdTime></IoMdTime>
      <h1>Timesheets</h1>
      <hr></hr>
      <p>Small description</p>
      </Bubble>
      <Bubble to={`/Portal/employee/${params.userID}/leave`}>
      <IoMdCalendar></IoMdCalendar>
      <h1>Leave</h1>
      <hr></hr>
      <p>Small description</p>
      </Bubble>
      <Bubble to={`/Portal/employee/${params.userID}/settings`} className="centered">
      <IoMdSettings></IoMdSettings>
      <h1>Settings</h1>
      <hr></hr>
      <p>Small description</p>
      </Bubble>
    </Layout>
    </>
    : <><Loading/><Footer/></>}
    </Dashboard>
  )
}

const Dashboard = styled.div`
display:grid;
`

const Layout = styled.div`
  display: grid;
  gap: 10%;
  grid-template-columns: repeat(2, minmax(20rem, 1fr));
  justify-self: center;
  align-items: center;

`
const Bubble = styled(Link)`
text-decoration: none;
color: #00060b;
height: 37vh;
width: 37vw;
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
export default EmployeePortal