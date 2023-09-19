import styled from "styled-components";
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { Loading2 as Loading } from "./Loading";

function CredentialResetForm() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [password2, setPassword2] = useState()
    const [oneTimeCode, setOneTimeCode] = useState()
    const [returnedOneTimeCode, setReturnedOneTimeCode] = useState()
    const [isAuthorised, setIsAuthorised] = useState("")
    const { register, handleSubmit, formState: { errors } } = useForm();
    let params = useParams()

    const submitFunc = async (information) => {

      if (information.password) {

        if (!password === password2) { //Checking password match each other
          alert('Passwords must match')
          setIsAuthorised('border-red')
        } else {

          const res = await fetch(`https://cpa-flask.azurewebsites.net/login/reset/'${sessionStorage.getItem('userID')}'/'${information.password}'`)
          const data = await res.json()

          if (data.success == 'Success') { //If the new password was set successfully
            alert('Password changed successfully')
            navigate('/login')
          } else { //If new password was unsuccessful
            alert(`An error occured\n\n\n\n${data.error}`)
          }
        }


      } else {
      
      //Function is executed on a login attempt

      setIsLoading(true)

      const res = await fetch(`https://cpa-flask.azurewebsites.net/login/forgot/${information.email}`)
      const data = await res.json()

      //Returned data contains bool of if login was a match, employee account haas been registered, role of account
    
      if (data.match === 'True') { 
        alert(`Your username and a one time code have been sent to '${information.email}', please use code to edit paassword or view email for username.`)
        setReturnedOneTimeCode(data.code)
        sessionStorage.setItem('userID',data.username)
      } else if(data.match === 'False') {

        //If there is no match for the specified email
        setIsAuthorised('border-red')
        alert("Email not found, please enter a registered email of an account")
      }
    }

      setIsLoading(false)
    }

    const codeCheck = (information) => { //checking the One Time Code matches

      setIsLoading(true)

      if (information.oneTimeCode === returnedOneTimeCode) {
        setIsAuthorised('border-green')
        navigate('/Forgot/reset')
      } else {
        setIsAuthorised('border-red')
        alert('Incorrect code')
      }

      setIsLoading(false)
    }
    
    function FormPage(type) { //Allows different form pages to load based off of the url paramater 'type'

      if (type === 'creds') {
        return (
        <>
        <div className={isAuthorised} id="center">
        <p>Email</p>
          <input 
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Enter Email" 
            value={email}
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          />{errors.email && <h6>Email is required</h6>}
          <br></br>
          </div>
        <button onClick={handleSubmit(submitFunc)}>Send Code</button>
      <div className={isAuthorised} id="center" >
        <p>One Time Code</p>
          <input 
            onChange={(e) => setOneTimeCode(e.target.value)}
            type="oneTimeCode"
            placeholder="Enter 6 digit Code" 
            value={oneTimeCode}
            {...register("oneTimeCode", { pattern: /^[0-9]{6}$/  })}
          />{errors.oneTimeCode && <h6>Code is required</h6>}
      </div>
      <button type="submit">Next</button>
      </>)
      }

    if (type === 'reset') {
      return (
        <>
        <div className={isAuthorised} id="center">
        <p>New Password</p>
          <input 
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter password" 
            value={password}
            {...register("password", { required: true, pattern: /^[a-zA-Z0-9 ]{1,30}$/ })}
          />{errors.password && <h6>Password is required</h6>}
        <p>Confirm Password</p>
          <input 
            onChange={(e) => setPassword2(e.target.value)}
            type="password"
            placeholder="Enter Password" 
            value={password2}
            {...register("password2", { required: true, pattern: /^[a-zA-Z0-9 ]{1,30}$/ })}
          />{errors.password2 && <h6>Password confirmation required</h6>}
          </div>
          <button onClick={handleSubmit(submitFunc)}>Next</button>
        </>
      )
    }
    }
  
    return (
        <Window onSubmit={handleSubmit(codeCheck)}>
          <Head>
            <img src="/Christian-Payroll-App-Logo.svg" alt="logo" />
              <p>Christian's Payroll App</p>
          </Head>
          
          {FormPage(params.type)}

          <br></br>
          <div>{isLoading ? <Loading className="Show"/> : <Loading className="Hide"/> }</div>
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
  export default CredentialResetForm