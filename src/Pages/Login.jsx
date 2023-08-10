import styled from "styled-components";
import { BiArrowBack } from 'react-icons/bi'
import { Link } from "react-router-dom";
import LoginForm from "../Components/login";

function Login() {

  return (
    <Page>
      <GoBack to={'/'} >
        <BiArrowBack size={50}></BiArrowBack>
        <p>Go Home</p>
      </GoBack>
      <LoginForm/>
    </Page> 
  )  
}


 const Page = styled.div`
  display: grid;
  background: #0b3048;
  min-height:fit-content + 5rem;

p {
  font-family: sans-serif;
  font-size: 20pt;
}

`

const GoBack = styled(Link)`
background: white;
  display: flex;
  margin-top: 1rem;
  margin-left: 1rem;
  height: 20%;
  align-items: center;
  min-height: fit-content;
  max-height: fit-content;
  width: fit-content;
  border-radius: 50px;
  text-decoration: none;
  justify-self: left;
  border: 1px solid black;
  svg {
  color: black;
  width: 2rem;
  }
  transition: 1s;
  opacity: 0.5;
  :hover {
        opacity: 1;
  }
  p {
    color: black;
    font-size: 1rem;
  }
`

export default Login