import styled from "styled-components";
import { BiArrowBack } from 'react-icons/bi'
import { Link } from "react-router-dom";
import ManagerRegisterForm from "../Components/ManagerRegister";

function ManagerRegister() {

  return (
    <Page>
      <GoBack to={'/'} >
        <BiArrowBack size={50}></BiArrowBack>
        <p>Go Home</p>
      </GoBack>
      <ManagerRegisterForm/>
    </Page> 
  )  
}


 const Page = styled.div`
  display: grid;
  background: grey;
p {
  font-family: sans-serif;
  font-size: 20pt;
}

`

const GoBack = styled(Link)`
  display: flex;
  color: white;
  text-decoration: none;
  justify-self: left;
  svg {
  color: white;
  padding-top: 1rem;
  }
  transition: 1s;
  opacity: 0.5;
  :hover {
        opacity: 1;
  }
`

export default ManagerRegister