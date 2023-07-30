import styled from "styled-components"
import SideBar from "../Components/Sidebar"
import {IoMdTime, IoMdHome, IoMdCalendar, IoMdCard, IoMdPerson} from "react-icons/io"
import { Link, useParams } from "react-router-dom"

function ManagerPortal() {
  let params = useParams()
  return (
    <Dashboard>
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
    </Dashboard>
  )
}

const Dashboard = styled.div`
display:grid;
background-image: linear-gradient(45deg, transparent 20%, black 25%, transparent 25%),
                      linear-gradient(-45deg, transparent 20%, black 25%, transparent 25%),
                      linear-gradient(-45deg, transparent 75%, black 80%, transparent 0%),
                      radial-gradient(gray 2px, transparent 0);
background-size: 900px 900px, 900px 900px;
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