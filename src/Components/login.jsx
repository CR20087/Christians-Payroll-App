import styled from "styled-components";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { Loading2 as Loading } from "./Loading";

function LoginForm() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [userName, setUserName] = useState()
    const [password, setPassword] = useState()
    const [isAuthorised, setIsAuthorised] = useState("")
    const { register, handleSubmit, formState: { errors } } = useForm();

    const FetchLogin = async (information) => {
      
      //Function is executed on a login attempt

      setIsLoading(true)

      const res = await fetch(`https://cpa-flask.azurewebsites.net/login/'${information.userName}'/'${information.password}'`)
      const data = await res.json()

      //Returned data contains bool of if login was a match, employee account haas been registered, role of account
    
      if ((data.match === 'True' && data.role === 'employee' && data.setup ==='True') || (data.match === 'True' && data.role === 'manager')) { 
        const userID = information.userName
        setIsAuthorised('border-green')
        
        function randomString(length, chars) {

          //Function to generate a random authentication key

          var result = '';
          for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
          return result;
        }
  
        const authKey = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
        sessionStorage.clear()
        sessionStorage.setItem('authKey',authKey)
        sessionStorage.setItem('userID', userID)
        sessionStorage.setItem('role',data.role)
        
        const res = await fetch(`https://cpa-flask.azurewebsites.net/auth/add/'${userID}'/'${authKey}'`) //Aadding Auth Key to database
        const auth_data = await res.json()

        if (auth_data.success === 'Failed') {
          
          //If the authentication was unsuccesful (unexpected event)

          setIsAuthorised('border-red')
          sessionStorage.clear()
          alert(`There was an error authenticating your credentials.\n\n\n\n${auth_data.error}`)
        } else {

          //If the authentication was successful

          navigate('/Portal/' +data.role + '/'+ userID )  
        }

      } else if(data.match === 'False') {

        //If there is no match for the specified username and password

        setIsAuthorised('border-red')
        sessionStorage.setItem('role',data.role)
      } else if (data.setup === 'False') {

        //If the employee account is unregistered

        setIsAuthorised('border-red')
        sessionStorage.setItem('role',data.role)
        alert("Please see the Register menu as your account has not yet been registered, thankyou.")
    }
      setIsLoading(false)
    }

    
  
    return (
        <Window onSubmit={handleSubmit(FetchLogin)}>
          <Head>
            <img src="./Christian-Payroll-App-Logo.svg" alt="logo" />
              <p>Christian's Payroll App</p>
          </Head>
          <div className={isAuthorised} id="center" >
            <p>User Name</p>
              <input 
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                placeholder="Enter Username" 
                value={userName}
                {...register("userName", { required: true, pattern: /^[a-zA-Z0-9]{1,30}$/ })}
              />{errors.userName && <h6>Username is required</h6>}
            <p>Password</p>
              <input 
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter Password" 
                value={password}
                {...register("password", { required: true,pattern: /^[a-zA-Z0-9 ]{1,30}$/  })}
              />{errors.password && <h6>Password is required</h6>}
          </div>
          <button type="submit">Login</button>
          <br></br>
          <div>{isLoading ? <Loading className="Show"/> : <Loading className="Hide"/> }</div>
          <FooterText to={"/Forgot/creds"}>Forgot Password/Username</FooterText>
          <FooterText to={"/Register/1"}>SignUp/Register</FooterText>
          <FooterText to={"/Register/manager/1"}>Manager Register</FooterText>
        </Window>      
    )  
  }
  
  //Styling

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
    margin-bottom: 2rem;
    padding: 1rem 0rem 2rem 0rem;

    #center {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

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
  
  const FooterText = styled(Link)`
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