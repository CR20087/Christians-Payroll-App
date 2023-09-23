import styled from "styled-components";
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { Loading2 as Loading } from './Loading'
import bcrypt from 'bcryptjs';

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

    sessionStorage.setItem('role','employee') //This is used by the support documentation to highlight appicable sections assuming the user is an 'employee' as they have visted this page.

    const FetchLogin = async (information) => {

      //Function to fetch login

      setIsLoading(true) //Loading symbol

      const res = await fetch(`https://cpa-flask.azurewebsites.net/register`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'username' : `'${information.userName}'`
      })
      })
      const data = await res.json()
      
      const match = await bcrypt.compare(information.password,data.password)

      if (match && data.config === 'False') { 

        //If the request returns that the account is a unregistered employee
        
        sessionStorage.setItem('userName',information.userName)
        navigate('/Register/' + (parseInt(params.pagenum)+1).toString()  )

      } else if (!match) {

        //If the login did not match

        setIsAuthorised('border-red')
        alert("Please check your login details and try again.\n\n If this persists please contact your manager and ask them check the login details OR configure your account (if not done yet).")
      } else if (data.config === 'True') {

        //If the account has already been registered

        setIsAuthorised('border-red')
        alert("You already have a registered account. Please see 'Forgot password' for password assitance. OR Contact your manager for username assistance.")
      }
  
      setIsLoading(false)
    }

    useEffect(() => {

      //Used to render different form pages

      setFormPage(params.pagenum);
  },[params.pagenum]);

  const InfoLog = async (information) => {

    //Function which saaves form information and submits it

    if (formPage === '2') {sessionStorage.setItem('firstName',information.firstName); sessionStorage.setItem('lastName',information.lastName)
      navigate('/Register/' + (parseInt(params.pagenum)+1).toString()  )
    }
    if (formPage === '3') {
      sessionStorage.setItem('email',information.email)
      sessionStorage.setItem('address',information.address)
      sessionStorage.setItem('suburb',information.suburb)
      sessionStorage.setItem('postCode',information.postCode)
      sessionStorage.setItem('phone',information.phone)

      navigate('/Register/' + (parseInt(params.pagenum)+1).toString()  )
    }
    if (formPage === '4') {

      //Submission Page

      setIsLoading(true)

      const res = await 
        fetch(`https://cpa-flask.azurewebsites.net/registerAccount`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'username' : `'${sessionStorage.getItem('userName')}'`,
          'firstname' : `'${sessionStorage.getItem('firstName')}'`,
          'lastname' : `'${sessionStorage.getItem('lastName')}'`,
          'email' : `'${sessionStorage.getItem('email')}'`,
          'address' : `'${sessionStorage.getItem('address')}'`,
          'suburb' : `'${sessionStorage.getItem('suburb')}'`,
          'postcode' : `'${sessionStorage.getItem('postCode')}'`,
          'phone' : `'${sessionStorage.getItem('phone')}'`
        })
        })
      const data = await res.json()
      

      if (data.success=== 'Success') {

        //If the account is successfully registered
        navigate('/Register/' + (parseInt(params.pagenum)+1).toString()  )
        sessionStorage.removeItem('userName')
        sessionStorage.removeItem('firstName')
        sessionStorage.removeItem('lastName')
        sessionStorage.removeItem('email')
        sessionStorage.removeItem('address')
        sessionStorage.removeItem('suburb')
        sessionStorage.removeItem('postCode')
        sessionStorage.removeItem('phone')
      } else {

        //If the registration fails

        alert(`Registering failed .Please check information and try again.\n\n\n\n${data.error}`)
      }

      
    }
  }


  function page(pagenum) {

    //Function which returns different pages per formpage

    if (pagenum === '1') {
      return(
        <div className={isAuthorised} >
            <p>User Name:</p>
              <input 
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                placeholder="Enter Username" 
                value={userName}
                {...register("userName", { required: true, pattern: /^[a-zA-Z0-9]{1,30}$/ })}
              />{errors.userName && <h6>Username is required</h6>}
            <p>Password:</p>
              <input 
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter Password" 
                value={password}
                {...register("password", { required: true, pattern: /^[a-zA-Z0-9 ]{1,30}$/ })}
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
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="First Name..." 
                value={firstName}
                {...register("firstName", { required: true, pattern: /^[A-Za-z]*$/ })}
            />{errors.firstName && <h6>First Name must be valid</h6>}
            <p>Last Name:</p>
              <input 
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Last Name..." 
                value={lastName}
                {...register("lastName", { required: true, pattern: /^[A-Za-z]*$/ })}
            />{errors.lastName && <h6>Last Name must be valid</h6>}
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
            />{errors.email && <h6>Email must be valid</h6>}
            <p>Address:</p>
              <input 
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                placeholder="Address..." 
                value={address}
                {...register("address", { required: true,pattern: /^[a-zA-Z0-9 ]*$/ })}
            />{errors.address && <h6>Address must be valid</h6>}
            <p>Suburb/City:</p>
              <input 
                onChange={(e) => setSuburb(e.target.value)}
                type="text"
                placeholder="Suburb/City..." 
                value={suburb}
                {...register("suburb", { required: true,pattern: /^[a-zA-Z]*$/ })}
            />{errors.suburb && <h6>Suburb/City must be valid</h6>}
            </div>
            <div className="large2 column">
            <p>Post Code:</p>
              <input 
                onChange={(e) => setPostCode(e.target.value)}
                type="text"
                placeholder="Post Code..." 
                value={postCode}
                {...register("postCode", { required: true,pattern: /^\d{4}$/ })}
            />{errors.postCode && <h6>Post Code must be valid</h6>}
            <p>Phone:</p>
              <input 
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                placeholder="Phone..." 
                value={phone}
                {...register("phone", { required: true,pattern: /^[+#]?\d{1,13}$/ })}
                />{errors.phone && <h6>Phone must be valid</h6>}
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
            <img src="/Christian-Payroll-App-Logo.svg" alt="logo" />
              <p>Christian's Payroll App</p>
          </Head>

          {page(formPage) /*Different Form pages are rendered here */}

          <div>{(isLoading && formPage==='4') || (formPage==='5') ? <button type="submit" hidden >Next</button> : <button type="submit">Next</button>}</div><br></br>
          <div>{isLoading ? <Loading className="Show"/> : <Loading className="Hide"/> }</div>
          <Signup to={"/Login"}>Go to Login Page</Signup>
          <Signup to={"/Support"}>See support page for valid examples</Signup>
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