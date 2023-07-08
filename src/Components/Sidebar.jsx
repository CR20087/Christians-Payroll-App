import styled from "styled-components"
import {IoMdSettings, IoMdTime, IoMdHome, IoMdCalendar, IoMdCard, IoMdPerson} from "react-icons/io"
import { Link, useParams } from "react-router-dom"

function SideBar() {

  let params = useParams()

  const portalType = sessionStorage.getItem('role')

  function NavType() {
    if (portalType === 'manager') {
      return(
        <div>
          <MenuItem to={`/Portal/manager/${params.userID}`}>
          <IoMdHome size={25}/>
          <p>Dashboard</p>
        </MenuItem>
        <MenuItem to={`/Portal/manager/${params.userID}/pay-run`}>
          <IoMdCard size={25}/>
          <p>Pay Run</p>
        </MenuItem>
        <MenuItem to={`/Portal/manager/${params.userID}/employee-timesheets`}>
          <IoMdTime size={25}/>
          <p>Employee Timesheets</p>
        </MenuItem>
        <MenuItem to={`/Portal/manager/${params.userID}/leave`}>
          <IoMdCalendar size={25}/>
          <p>Leave</p>
        </MenuItem>
        <MenuItem to={`/Portal/manager/${params.userID}/employee-settings`}>
          <IoMdPerson size={25}/>
          <p>Employee Settings</p>
        </MenuItem>
        <MenuItem to={`/Portal/manager/${params.userID}/settings`}>
          <IoMdSettings size={25}/>
          <p>Settings</p>
        </MenuItem>
        </div>
      )
    } else if (portalType === 'employee') {
      return(
        <div>
          <MenuItem to={`/Portal/employee/${params.userID}`}>
          <IoMdHome size={25}/>
          <p>Dashboard</p>
        </MenuItem>
        <MenuItem to={`/Portal/employee/${params.userID}/timesheet`}>
          <IoMdTime size={25}/>
          <p>Timesheet</p>
        </MenuItem>
        <MenuItem to={`/Portal/employee/${params.userID}/leave`}>
          <IoMdCalendar size={25}/>
          <p>Leave</p>
        </MenuItem>
        <MenuItem to={`/Portal/employee/${params.userID}/settings`}>
          <IoMdSettings size={25}/>
          <p>Settings</p>
        </MenuItem>
        </div>
      )
    } else {
      <MenuItem>
          <p>Authentication Error please login again</p>
      </MenuItem>
    }
  }


  return (
      <SideBarDiv>
        
        {NavType()}
        
        <Logo>
            <img src="/Christian-Payroll-App-Logo.png" alt="logo"  />
            <p>Christian's Payroll App</p>
        </Logo>
        
        <h1>M<br></br>E<br></br>N<br></br>U<br></br></h1>
      </SideBarDiv>
  )
}


const Logo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  
  p {
    font-weight: 650;
  }
`

const MenuItem = styled(Link)`

  flex-direction: column;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-decoration: none;
  color: black;
  padding-bottom: 3rem;

  svg {
    color: #0707d6;
  }
`

const SideBarDiv = styled.div`
position: fixed;
  display: flex;
  justify-content: center;
  width: 5%;
  transition: 1s;
  background-color: black ;
  flex-direction: column-reverse;
  align-items: center;
  p {
    visibility: hidden;
  }
  h1{
    padding: 50px;
    visibility: visible;
    color: white;
  }
  img {
      visibility: hidden;
      width: 0%;
      height:0%
    }
  :hover{
    background-color:grey ;
    width:18%;
    p {
    visibility: visible;
  }
    img {
      visibility: visible;
      width: 15vh;
      height:15vh;
    }
    h1{
      visibility: hidden;
      width: 0%;
      height:0%
      
  }
  }
`

export default SideBar
