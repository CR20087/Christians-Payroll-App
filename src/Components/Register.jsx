import styled from "styled-components";
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";

function RegisterForm() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [userName, setUserName] = useState()
    const [password, setPassword] = useState()
    const [lastName, setLastName] = useState()
    const [firstName, setFirstName] = useState()
    const [email, setEmail] = useState()
    const [address, setAddress] = useState()
    const [suburb, setSuburb] = useState()
    const [postCode, setPostCode] = useState()
    const [phone, setPhone] = useState()
    const [isAuthorised, setIsAuthorised] = useState("")
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [formPage, setFormPage] = useState('1')
    let params = useParams()
  

    const FetchLogin = async (information) => {

      setIsLoading(true)

      console.log(information)

      const res = await fetch(`/Register/'${information.userName}'/'${information.password}'`)
      const data = await res.json()
      console.log(data)
      console.log(information.userName+' '+information.password)
    
      if (data.match === 'True' && data.config === 'False') { 
        
        sessionStorage.setItem('userName',information.userName)
        navigate('/Register/' + (parseInt(params.pagenum)+1).toString()  )

      } else if (data.match === 'False') {
        setIsAuthorised('border-red')
        alert("Please check your login details and try again.\n\n If this persists please contact your manager and ask them check the login details OR configure your account (if not done yet).")
      } else if (data.config === 'True') {
        setIsAuthorised('border-red')
        alert("You already have a registered account. Please see 'Forgot password' for password assitance. OR Contact your manager for username assistance.")
      }
  
      setIsLoading(false)
    }

    useEffect(() => {
      setFormPage(params.pagenum);
  },[params.pagenum]);

  const InfoLog = async (information) => {
    if (formPage === '2') {sessionStorage.setItem('firstName',information.firstName); sessionStorage.setItem('lastName',information.lastName)
      navigate('/Register/' + (parseInt(params.pagenum)+1).toString()  )
    }
    if (formPage === '3') {
      sessionStorage.setItem('phone',information.email)
      sessionStorage.setItem('address',information.address)
      sessionStorage.setItem('suburb',information.suburb)
      sessionStorage.setItem('postCode',information.postCode)
      sessionStorage.setItem('phone',information.phone)

      navigate('/Register/' + (parseInt(params.pagenum)+1).toString()  )
    }
    if (formPage === '4') {
      setIsLoading(true)

      const res = await 
        fetch(`/registerAccount/${sessionStorage.getItem('userName')}/${sessionStorage.getItem('firstName')}/${sessionStorage.getItem('lastName')}/${sessionStorage.getItem('email')}/${sessionStorage.getItem('address')}/${sessionStorage.getItem('suburb')}/${sessionStorage.getItem('postCode')}/${sessionStorage.getItem('phone')}`)
      const data = await res.json()
      console.log(data)

      if (data.success=== 'True') {
        navigate('/Register/' + (parseInt(params.pagenum)+1).toString()  )
      } else {
        alert("Registering failed unexpectedley.")
      }

      
    }
  }


  function page(pagenum) {
    if (pagenum === '1') {
      return(
        <div className={isAuthorised} >
            <p>User Name:</p>
              <input 
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="Enter Username" 
                value={userName}
                {...register("username", { required: true })}
              />{errors.userName && <h6>Username is required</h6>}
            <p>Password:</p>
              <input 
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter Password" 
                value={password}
                {...register("password", { required: true })}
              />{errors.password && <h6>Password is required</h6>}
              <br></br>
        </div>
      )
    }

    if (pagenum === '2') {
      return(
        <div className={isAuthorised} >
            <p>First Name:</p>
              <input 
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                placeholder="First Name..." 
                value={firstName}
                {...register("firstName", { required: true })}
            />{errors.firstName && <h6>First Name is required</h6>}
            <p>Last Name:</p>
              <input 
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Last Name..." 
                value={lastName}
                {...register("lastName", { required: true })}
            />{errors.lastName && <h6>Last Name is required</h6>}
            <br></br>
        </div>
      )
    }

    if (pagenum === '3') {
      return(
        <div className={isAuthorised}  >
          <div className="large1 column">
            <p>Email:</p>
              <input 
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Email..." 
                value={email}
                {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />{errors.email && <h6>Email is required and must be valid</h6>}
            <p>Address:</p>
              <input 
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                placeholder="Address..." 
                value={address}
                {...register("address", { required: true })}
            />{errors.address && <h6>Address is required</h6>}
            <p>Suburb/City:</p>
              <input 
                onChange={(e) => setSuburb(e.target.value)}
                type="text"
                placeholder="Suburb/City..." 
                value={suburb}
                {...register("suburb", { required: true })}
            />{errors.suburb && <h6>Suburb/City is required</h6>}
            </div>
            <div className="large2 column">
            <p>Post Code:</p>
              <input 
                onChange={(e) => setPostCode(e.target.value)}
                type="text"
                placeholder="Post Code..." 
                value={postCode}
                {...register("postCode", { required: true })}
            />{errors.postCode && <h6>Post Code is required</h6>}
            <p>Phone:</p>
              <input 
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                placeholder="Phone..." 
                value={phone}
                {...register("phone")}
            />
            
            </div>
            <br></br>
        </div>
      )
    }

    if (pagenum === '4') {
      return(
        <div>
          <h5>Registering Account</h5>
        </div>
      )
  }

  if (pagenum === '5') {
    return(
      <div>
        <h5>Account Registered. Please go to login page to login</h5>
      </div>
    )

}
}
  
    return (
        <Window onSubmit={handleSubmit(parseInt(formPage) > 1 ? InfoLog : FetchLogin)}>
          <Head>
            <img src="/Christian-Payroll-App-Logo.png" alt="logo" />
              <p>Christian's Payroll App</p>
          </Head>

          {page(formPage)}

          <div>{(isLoading && formPage==='4') || (formPage==='5') ? <button type="submit" hidden >Next</button> : <button type="submit">Next</button>}</div><br></br>
          <div>{isLoading ? <Loading className="Show"/> : <Loading className="Hide"/> }</div>
          <Signup to={"/Login"}>Go to Login Page</Signup>
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
    height: fit-content;
    min-height: 35rem;
    color: #313131;
    background: #eedede;
    border: 4px solid black;
    font-weight: 600;
    transition: 1s;
    opacity: 0.92;
    .column {
      width:45%;
    }
    .large1 {
        justify-items: left;
        float: left;
      }
    .large2 {
      justify-items: right;
      float:right;
    }
    h6 {
      color: red;
    }
    :hover {
          opacity: 1;
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
    text-align: center;
    display: block;
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
  export default RegisterForm