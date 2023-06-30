import styled from "styled-components"

function Portal() {

  

  return (
    <Dashboard>
      <SideBar>
        <Logo>
            <img src="./Christian-Payroll-App-Logo.png" alt="logo" width={150} />
            <p>Christian's Payroll App</p>
            <h1>M<br></br>E<br></br>N<br></br>U<br></br></h1>
        </Logo>
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
  width: 7%;
  transition: 1s;
  background-color: black ;
  p {
    visibility: hidden;
  }
  h1{
    opacity:1;
    color: white;
  }
  img {
      visibility: hidden;
    }
  :hover{
    background-color:green ;
    width:25%;
    p {
    visibility: visible;
  }
    img {
      visibility: visible;
    }
    h1{
    opacity:0;
  }
  }
`

const Dashboard = styled.div`
  background-color: white;
`

export default Portal
