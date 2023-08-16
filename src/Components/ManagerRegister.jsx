import styled from "styled-components";
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";

function ManagerRegisterForm() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [userName, setUserName] = useState()
    const [password, setPassword] = useState()
    const [lastName, setLastName] = useState()
    const [firstName, setFirstName] = useState()
    const [email, setEmail] = useState()
    const [address, setAddress] = useState()
    const [suburb, setSuburb] = useState()
    const [businessName, setBusinessName] = useState()
    const [phone, setPhone] = useState()
    const [entityName, setEntityName] = useState()
    const [contactMethod, setContactMethod] = useState()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [formPage, setFormPage] = useState('1')
    let params = useParams()
  

    useEffect(() => {
      setFormPage(params.pagenum);
  },[params.pagenum]);

  const InfoLog = async (information) => {

    if (formPage === '1') {navigate('/Register/manager/' + (parseInt(params.pagenum)+1).toString() ) }

    if (formPage === '2') {sessionStorage.setItem('userName',information.userName); sessionStorage.setItem('password',information.password)
      navigate('/Register/manager/' + (parseInt(params.pagenum)+1).toString() ) 
    }

    if (formPage === '3') {sessionStorage.setItem('firstName',information.firstName); sessionStorage.setItem('lastName',information.lastName)
      navigate('/Register/manager/' + (parseInt(params.pagenum)+1).toString()  )
    }

    if (formPage === '4') {
      sessionStorage.setItem('email',information.email)
      sessionStorage.setItem('address',information.address)
      sessionStorage.setItem('suburb',information.suburb)
      sessionStorage.setItem('businessName',information.businessName)
      sessionStorage.setItem('entityName',information.entityName)
      sessionStorage.setItem('phone',information.phone)
      sessionStorage.setItem('contactMethod',information.contactMethod)
      

      navigate('/Register/manager/' + (parseInt(params.pagenum)+1).toString()  )
    }
    if (formPage === '5') {
      setIsLoading(true)

      const res = await 
        fetch(`https://cpa-flask.azurewebsites.net/registerAccount/manager/'${sessionStorage.getItem('userName')}'/'${sessionStorage.getItem('password')}'/'${sessionStorage.getItem('firstName')}'/'${sessionStorage.getItem('lastName')}'/'${sessionStorage.getItem('email')}'/'${sessionStorage.getItem('address')}'/'${sessionStorage.getItem('suburb')}'/'${sessionStorage.getItem('businessName')}'/'${sessionStorage.getItem('phone')}'/'${sessionStorage.getItem('entityName')}'/'${sessionStorage.getItem('contactMethod')}'`)
      const data = await res.json()
      console.log(data)

      if (data.success=== 'Success') {
        navigate('/Register/manager/' + (parseInt(params.pagenum)+1).toString()  )
        sessionStorage.removeItem('userName')
        sessionStorage.removeItem('password')
        sessionStorage.removeItem('firstName')
        sessionStorage.removeItem('lastName')
        sessionStorage.removeItem('email')
        sessionStorage.removeItem('address')
        sessionStorage.removeItem('suburb')
        sessionStorage.removeItem('phone')
        sessionStorage.removeItem('contactMethod')
        sessionStorage.removeItem('businessName')
        sessionStorage.removeItem('entityName')

      } else {
        alert(`Registering failed .Please check information and try again.\n\n\n\n${data.error}`)
      }
    }
  }


  function page(pagenum) {
    if (pagenum === '1') {
      return(
        <div>
            <h5>Welcome to Christian's Payroll App. Please create an account to get started.</h5>
              <br></br>
        </div>
      )
    }

    if (pagenum === '2') {
      return(
        <div>
            <p>User Name:</p>
              <input 
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                placeholder="Enter Username" 
                value={userName}
                {...register("userName", { required: true, pattern: /^[a-zA-Z0-9]{1,30}$/ })}
              />{errors.userName && <h6>Username must be valid</h6>}
            <p>Password:</p>
              <input 
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter Password" 
                value={password}
                {...register("password", { required: true,pattern: /^[a-zA-Z0-9^"'\/]*$/ })}
              />{errors.password && <h6>Password must be valid</h6>}
              <br></br>
        </div>
      )
    }

    if (pagenum === '3') {
      return(
        <div>
            <p>First Name:</p>
              <input 
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="First Name..." 
                value={firstName}
                {...register("firstName", { required: true,pattern: /^[a-zA-Z]+$/ })}
            />{errors.firstName && <h6>First Name must be valid</h6>}
            <p>Last Name:</p>
              <input 
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Last Name..." 
                value={lastName}
                {...register("lastName", { required: true,pattern: /^[a-zA-Z]+$/ })}
            />{errors.lastName && <h6>Last Name must be valid</h6>}
            <br></br>
        </div>
      )
    }

    if (pagenum === '4') {
      return(
        <div >
          <div className="large1 column">
            <p>Email:</p>
              <input 
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Email..." 
                value={email}
                {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />{errors.email && <h6>Email must be valid</h6>}
            <p>Phone:</p>
              <input 
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                placeholder="Phone..." 
                value={phone}
                {...register("phone", { required: true,pattern: /^[+#]?\d{1,13}$/ })}
                />{errors.phone && <h6>Phone must be valid</h6>}
            <p>Contact Method For Employees:</p>
            <select 
            value={contactMethod} 
            onChange={(e) => setContactMethod(e.target.value)}
            {...register("contactMethod", { required: true })}>
                <option value="">Select</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
            </select>{errors.contactMethod && <h6>Contact Method must be valid</h6>}
            </div>
            <div className="large2 column">
            <p>Business Name:</p>
              <input 
                onChange={(e) => setBusinessName(e.target.value)}
                type="text"
                placeholder="Business Name..." 
                value={businessName}
                {...register("businessName", { required: true,pattern: /^[a-zA-Z0-9 ]*$/ })}
            />{errors.address && <h6>Business Name must be valid</h6>}
                <p>Business Address:</p>
              <input 
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                placeholder="Address..." 
                value={address}
                {...register("address", { required: true,pattern: /^[a-zA-Z0-9 ]*$/ })}
            />{errors.address && <h6>Business address must be valid</h6>}
            <p>Business Suburb/City:</p>
              <input 
                onChange={(e) => setSuburb(e.target.value)}
                type="text"
                placeholder="Suburb/City..." 
                value={suburb}
                {...register("suburb", { required: true,pattern: /^[a-zA-Z]*$/ })}
            />{errors.suburb && <h6>Suburb/City must be valid</h6>}
            <p>Entity Name:</p>
              <input 
                onChange={(e) => setEntityName(e.target.value)}
                type="text"
                placeholder="Entity name..." 
                value={entityName}
                {...register("entityName", { required: true,pattern: /^[a-zA-Z0-9 ]*$/ })}
            />{errors.entityName && <h6>Entity Name must be valid</h6>}
            </div>
            <br></br>
        </div>
      )
    }

    if (pagenum === '5') {
      return(
        <div>
          <h5>Registering Account</h5>
        </div>
      )
  }

  if (pagenum === '6') {
    return(
      <div>
        <h5>Account Registered. Please go to login page to login</h5>
      </div>
    )

}
}
  
    return (
        <Window onSubmit={handleSubmit(InfoLog)}>
          <Head>
            <img src="/Christian-Payroll-App-Logo.svg" alt="logo" />
              <p>Christian's Payroll App</p>
          </Head>

          {page(formPage)}

          <div>{(isLoading && formPage==='5') || (formPage==='6') ? <button type="submit" hidden >Next</button> : <button type="submit">Next</button>}</div><br></br>
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
    min-width: 35rem;
    width: fit-content;
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
        padding-left: 2rem;
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
  select {
    width:inherit;
    text-align: center;
  }
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
  export default ManagerRegisterForm