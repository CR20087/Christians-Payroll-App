import { useState } from "react"
import styled from "styled-components"
import { useParams } from "react-router-dom";
import { useEffect } from "react";
function EmployeeSettingsForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [inputValues, setInputValues] = useState({
        userName: '',og_userName: '',
        password: '',og_password: '',
        email: '',og_email: '',
        lastName: '',og_lastName: '',
        firstName: '',og_firstName: '',
        address: '',og_address: '',
        suburb: '',og_suburb: '',
        postCode: '',og_postCode: '',
        phone: '',og_phone: ''
      });
    const [isAuthorised, setIsAuthorised] = useState("")
    const [errors, setErrors] = useState({});
    let params = useParams()

    useEffect(() => {
        
        async function fetchData()  {
            const res = await fetch(`https://cpa-flask.azurewebsites.net/settings/employee/'${params.userID}'`)
            const data = await res.json()

            console.log(data)

            setInputValue('userName',data.userName); setInputValue('og_userName',data.userName);  
            setInputValue('password',data.password); setInputValue('og_password',data.password);  
            setInputValue('email',data.email); setInputValue('og_email',data.email);  
            setInputValue('lastName',data.lastName); setInputValue('og_lastName',data.lastName);  
            setInputValue('firstName',data.firstName); setInputValue('og_firstName',data.firstName);  
            setInputValue('address',data.address); setInputValue('og_address',data.address);  
            setInputValue('suburb',data.suburb); setInputValue('og_suburb',data.suburb);  
            setInputValue('postCode',data.postCode); setInputValue('og_postCode',data.postCode);    
            setInputValue('phone',data.phone); setInputValue('og_phone',data.phone); 
        } 
            
        fetchData()

    },[params.userID])

    const InfoLog = async (information) => {
        setIsLoading(true)
       
        if ((getInputValue('userName') !== getInputValue('og_userName'))
        || (getInputValue('password') !== getInputValue('og_password'))
        || (getInputValue('lastName') !== getInputValue('og_lastName'))
        || (getInputValue('firstName') !== getInputValue('og_firstName'))
        || (getInputValue('email') !== getInputValue('og_email'))
        || (getInputValue('address') !== getInputValue('og_address'))
        || (getInputValue('suburb') !== getInputValue('og_suburb'))
        || (getInputValue('postCode') !== getInputValue('og_postcode'))
        || (getInputValue('phone') !== getInputValue('og_phone')) ) {
            console.log("Change detected")
            const res = await fetch(
                `https://cpa-flask.azurewebsites.net/settings/employee/update/${sessionStorage.getItem('userID')}/${getInputValue('userName')}/${getInputValue('password')}/${getInputValue('firstName')}/${getInputValue('lastName')}/${getInputValue('email')}/${getInputValue('phone')}/${getInputValue('address')}/${getInputValue('suburb')}/${getInputValue('postCode')}`
                )
            const data = await res.json()

            if (data.success === 'Success') {
                alert("Changes updated successfully")
                setIsAuthorised('border-green')
                sessionStorage.setItem('userID',getInputValue('userName'))
            } else {
                alert(`An error occured please check information and try again\n\n\n\n${data.error}`)
                setIsAuthorised('border-red')
            }
            
            } else {
                setIsAuthorised('border-green')
            }

        setIsLoading(false)
    }

    //Error Handling
      const setInputValue = (fieldName, value) => {
        setInputValues((prevInputValues) => ({
          ...prevInputValues,
          [fieldName]: value,
        }));
      };
      
      const getInputValue = (fieldName) => {
        return inputValues[fieldName] || '';
      };
      
      const handleSubmit = (event) => {
        event.preventDefault();
      
        const newErrors = {};
      
            if (!inputValues.userName) {
            newErrors.userName = 'Username cannot be empty';
            }
            if (!inputValues.password) {
            newErrors.password = 'Password cannot be empty';
            }
            if (!inputValues.firstName) {
                newErrors.firstName = 'First name cannot be empty';
            }
            if (!inputValues.lastName) {
                newErrors.lastName = 'Last name cannot be empty';
            }
          if (!inputValues.email) {
            newErrors.email = 'Email cannot be empty';
          } else {
            const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailPattern.test(inputValues.email)) {
              newErrors.email = 'Invalid email address';
                }
            }
          if (!inputValues.phone) {
            newErrors.phone = 'Phone cannot be empty';
          }
          if (!inputValues.postCode) {
            newErrors.postCode = 'Post Code cannot be empty';
          }
          if (!inputValues.address) {
            newErrors.address = 'Address cannot be empty';
          }
          if (!inputValues.suburb) {
            newErrors.suburb = 'Business Suburb/City cannot be empty';
          }
      
        setErrors(newErrors);
      
        if (Object.keys(newErrors).length > 0) {
          return;
        }
      
        InfoLog(event);
      };
      
    
  return (
    <Form onSubmit={handleSubmit} >        
         <div className={isAuthorised}>
            <h1>Employee Settings</h1>
            <p>User Name:</p>
            <input 
                onChange={(e) => setInputValue('userName', e.target.value)}
                type="text"
                placeholder="Enter Username" 
                value={getInputValue('userName')}
              />{errors.userName && <h6>{errors.userName}</h6>}
            <p>Password:</p>
              <input 
                onChange={(e) => setInputValue('password', e.target.value)}
                type="password"
                placeholder="Password..." 
                value={getInputValue('password')}
            />{errors.password && <h6>{errors.password}</h6>}
            <p>First Name:</p>
              <input 
                onChange={(e) => setInputValue('firstName', e.target.value)}
                type="text"
                placeholder="First Name..." 
                value={getInputValue('firstName')}
            />{errors.firstName && <h6>{errors.firstName}</h6>}
            <p>Last Name:</p>
              <input 
                onChange={(e) => setInputValue('lastName', e.target.value)}
                type="text"
                placeholder="Last Name..." 
                value={getInputValue('lastName')}
            />{errors.lastName && <h6>{errors.lastName}</h6>}
            <p>Email:</p>
              <input 
                onChange={(e) => setInputValue('email', e.target.value)}
                type="text"
                placeholder="Email..." 
                value={getInputValue('email')}
            />{errors.email && <h6>{errors.email}</h6>}
            <p>Phone:</p>
              <input 
                onChange={(e) => setInputValue('phone', e.target.value)}
                type="text"
                placeholder="Phone..." 
                value={getInputValue('phone')}
                />{errors.phone && <h6>{errors.phone}</h6>}
            <p>Address:</p>
              <input 
                onChange={(e) => setInputValue('address', e.target.value)}
                type="text"
                placeholder="Address..." 
                value={getInputValue('address')}
            />{errors.address && <h6>{errors.address}</h6>}
            <p>Post Code:</p>
              <input 
                onChange={(e) => setInputValue('postCode', e.target.value)}
                type="text"
                placeholder="Post Code..." 
                value={getInputValue('postCode')}
            />{errors.postCode && <h6>{errors.postCode}</h6>}
            <p>Suburb/City:</p>
              <input 
                onChange={(e) => setInputValue('suburb', e.target.value)}
                type="text"
                placeholder="Suburb/City..." 
                value={getInputValue('suburb')}
            />{errors.suburb && <h6>{errors.suburb}</h6>}
            <br></br><br></br>
            </div>
            <div><button type="submit">Save</button></div>
            {isLoading ? <Loading className="Show"/> : <Loading className="Hide"/> }
    </Form>
  )
}
const Form = styled.form`
    display: flex;
    justify-self: center;
    width: 40%;
    height: fit-content;
    background: #dfdddd;
    border: 4px solid black;
    justify-content: center;
    align-self: center;
    h6 {
        color: red;
    }
    .border-red {
    input {
      border: 1.5px solid red;
            
    }
    
    select {
        border: 1.5px solid red;
    }}

    .border-green {
    input {
      border: 1.5px solid green;
    }
    select {
        border: 1.5px solid green;
    }}
    p {
        padding-top: 3rem;
        padding-left: 1rem;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
        font-size: larger;
        text-align: center;
    }
    input {
        width: 100%;
    }
    select {
        width: 100%;
    }
    h1 {
        font-weight:400;
        text-align:center;
    }
    .Show {
      visibility: visible;
    }
  .Hide {
    visibility: hidden;
  }

`

const Loading = styled.div `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
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

export default EmployeeSettingsForm