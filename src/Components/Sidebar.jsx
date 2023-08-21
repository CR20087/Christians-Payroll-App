import styled from "styled-components"
import {IoMdSettings, IoMdTime, IoMdHome, IoMdCalendar, IoMdCard, IoMdPerson} from "react-icons/io"
import { Link, useParams } from "react-router-dom"

function SideBar() {

  let params = useParams()

  const portalType = sessionStorage.getItem('role')

  function NavType() {
    if (portalType === 'manager') {
      return(
        <Shortcuts>
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
        <MenuItem to={`/Portal/manager/${params.userID}/employee-view`}>
          <IoMdPerson size={25}/>
          <p>Employee View</p>
        </MenuItem>
        <MenuItem to={`/Portal/manager/${params.userID}/settings`}>
          <IoMdSettings size={25}/>
          <p>Settings</p>
        </MenuItem>
        </Shortcuts>
      )
    } else if (portalType === 'employee') {
      return(
        <Shortcuts>
          <MenuItem to={`/Portal/employee/${params.userID}`}>
          <IoMdHome size={25}/>
          <p>Dashboard</p>
        </MenuItem>
        <MenuItem to={`/Portal/employee/${params.userID}/timesheets`}>
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
        </Shortcuts>
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
            <img src="/Christian-Payroll-App-Logo.svg" alt="logo"  />
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
  height: fit-content;
  img {
    max-width: 100%;
  }
  
  p {
    font-weight: 650;
    text-align: center;
  }
`

const Shortcuts = styled.div`
  display: grid;
  align-content: space-between;
  padding-bottom: 1rem;
`

const MenuItem = styled(Link)`

  flex-direction: column;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #000000;

  svg {
    color: #ffffff;
  }
`

const SideBarDiv = styled.div`
position: fixed;
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  width: 5%;
  z-index: 10;
  transition: 1s;
  background-color: #0b3048 ;
  flex-direction: column-reverse;
  align-items: center;
  p {
    visibility: hidden;
    display: none;
  }
  h1{
    padding: 50px;
    visibility: visible;
    color: white;
  }
  img {
      visibility: hidden;
      display: none;
    }
  :hover{
    background-color: #06151f;
    width:18%;
    p {
    visibility: visible;
    color: white;
    display: block;
  }
    img {
      visibility: visible;
      width: 15vh;
      height:15vh;
      display: block;
    }
    h1{
      visibility: hidden;
      display: none;
      
  }
  }
`

export default SideBar
