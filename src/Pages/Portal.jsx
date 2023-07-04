import styled from "styled-components"

function Portal() {

  

  return (
    <Dashboard>
      <SideBar>
        <Logo>
            <img src="/Christian-Payroll-App-Logo.png" alt="logo" width={150} />
            <p>Christian's Payroll App</p>
        </Logo>
        <h1>M<br></br>E<br></br>N<br></br>U<br></br></h1>
      </SideBar>
  </Dashboard>
  )
}


const Logo = styled.div`
  display: flex;
  
  p {
    padding-top: 2rem;
    }
  img {
    width: 35%;
    height: 80%
  }
`
const SideBar = styled.div`
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
    visibility: visible;
    color: white;
  }
  img {
      visibility: hidden;
    }
  :hover{
    background-color:green ;
    width:18%;
    p {
    visibility: visible;
  }
    img {
      visibility: visible;
    }
    h1{
      visibility: hidden;
      width: 0%;
      height:0%
      
  }
  }
`

const Dashboard = styled.div`
  background-color: white;
`

export default Portal
