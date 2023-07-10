import styled from "styled-components";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';

function LoginForm() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [userName, setUserName] = useState()
    const [password, setPassword] = useState()
    const [isAuthorised, setIsAuthorised] = useState("")
    const { register, handleSubmit, formState: { errors } } = useForm();

    const FetchLogin = async (information) => {

      setIsLoading(true)

      console.log(information)

      const res = await fetch(`https://cpa-flask.azurewebsites.net/login/'${information.userName}'/'${information.password}'`)
      const data = await res.json()
      console.log(data)
      console.log(information.userName+' '+information.password)
    
      if ((data.match === 'True' && data.role === 'employee' && data.setup ==='True') || (data.match === 'True' && data.role === 'manager')) { 
        const userID = information.userName
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
        sessionStorage.setItem('role',data.role)
  
        navigate('/Portal/' +data.role + '/'+ userID )      
      } else if(data.match === 'False') {
        setIsAuthorised('border-red')
      } else if (data.setup === 'False') {
        setIsAuthorised('border-red')
        alert("Please see the Register menu as your account has not yet been registered, thankyou.")
    }
  
      setIsLoading(false)
    }

    
  
    return (
        <Window onSubmit={handleSubmit(FetchLogin)}>
          <Head>
            <img src="./Christian-Payroll-App-Logo.png" alt="logo" />
              <p>Christian's Payroll App</p>
          </Head>
          <div className={isAuthorised} >
            <p>User Name:</p>
              <input 
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                placeholder="Enter Username" 
                value={userName}
                {...register("userName", { required: true })}
              />{errors.userName && <h6>Username is required</h6>}
            <p>Password:</p>
              <input 
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter Password" 
                value={password}
                {...register("password", { required: true })}
              />{errors.password && <h6>Password is required</h6>}
          </div>
          <button type="submit">Login</button>
          <div>{isLoading ? <Loading className="Show"/> : <Loading className="Hide"/> }</div>
          <Signup to={"/Register/1"}>Signup/Register</Signup>
        </Window>      
    )  
  }
  

  
  const Window = styled.form`
    justify-self: center;
    display: grid;
    justify-content: center;
    align-items: end;
    justify-items: center;
    width: 35rem;
    height: 40rem;
    color: #313131;
    background: #eedede;
    border: 4px solid black;
    font-weight: 600;
    transition: 1s;
    opacity: 0.92;
    h6 {
      color: red;
    }
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
  
  
  const Loading = styled.div `
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
  const Signup = styled(Link)`
    text-decoration: none;
    color: #313131;
    font-weight: 700;
  `
  const Head = styled.div`
    display: flex;
  
    p {
      padding-top: 1rem;
    text-align:center;
    }
    img {
      width: 35%;
      height: 80%
    }
  `
  export default LoginForm