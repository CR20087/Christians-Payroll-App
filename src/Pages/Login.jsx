import styled from "styled-components";
import {useState} from 'react';
import { BiArrowBack } from 'react-icons/bi'
import { Link, useNavigate} from "react-router-dom";

function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [isAuthorised, setIsAuthorised] = useState("")
 
  function FetchLogin() {

    setIsLoading(true)

    if (userName === 'CReid' & password === 'dev') { //Testing purposes
      const userID = userName //Testing purposes
      setIsAuthorised('border-green')
      
      function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
      }

      const authKey = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
      sessionStorage.clear()
      sessionStorage.setItem('authKey',authKey)
      sessionStorage.setItem('userID', userID)

      navigate('/Portal/' + userID )      
    } else {
      setIsAuthorised('border-red')
    }
    
    setIsLoading(false)
  }

  return (
    <Page>
      <GoBack to={'/'} >
        <BiArrowBack size={50}></BiArrowBack>
        <p>Go Home</p>
      </GoBack>
      <Window >
        <Head>
          <img src="./Christian-Payroll-App-Logo.png" alt="logo" />
            <p>Christian's Payroll App</p>
        </Head>
        <div className={isAuthorised} >
          <p>User Name:</p>
            <input 
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              spellCheck= "true"
              placeholder="Enter Username" 
              value={userName}
            />
          <p>Password:</p>
            <input 
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              spellCheck= "true"
              placeholder="Enter Password" 
              value={password}
            />
        </div>
        <button onClick={FetchLogin}>Login</button>
        <div>{isLoading ? <Loading className="Show"/> : <Loading className="Hide"/> }</div>
      </Window>      
    </Page> 
  )  
}


 const Page = styled.div`
  display: grid;
  background: #0c5c0c;
p {
  font-family: sans-serif;
  font-size: 20pt;
}

`

const Window = styled.button`
  justify-self: center;
  display: grid;
  justify-content: center;
  width: 35rem;
  height: 40rem;
  color: #313131;
  background: #eedede;
  border: 4px solid black;
  font-weight: 600;
  transition: 1s;
  opacity: 0.92;
  :hover {
        opacity: 1;
        width: 37rem;
        height: 42rem;
      }
   input {
    ::placeholder {
      text-align: center;
    }
   }
  .border-red {
  input {
    border: 1.5px solid red;
  }}
  .border-green {
  input {
    border: 1.5px solid green;
  }}
  button {
    width: 5rem;
    justify-self: center;
    :hover {
      background: #313131;
      color: #eedede;
    }
  }
.Show {
    visibility: visible;
  }
.Hide {
  visibility: hidden;
}`

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

const Loading = styled.div `
  margin-left: 45%;
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #383636;
  border-radius: 50%;
  animation: spinner 1.5s linear infinite;
  @keyframes spinner {
    0% {
    transform: rotate(0deg);
    }
    100% {
    transform: rotate(360deg);
    }
  }

`

const Head = styled.div`
  display: flex;

  p {
  padding-top: 2rem;
  }
  img {
    width: 35%;
    height: 80%
  }
`
export default Login