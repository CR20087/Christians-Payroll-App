import { useState } from "react"
import styled from "styled-components"
import { useParams } from "react-router-dom";
import { useEffect } from "react";
function ManagerSettingsForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [inputValues, setInputValues] = useState({
        userName: '',
        password: '',
        email: '',
        lastName: '',
        firstName: '',
        address: '',
        suburb: '',
        contactMethod: '',
        businessName: '',
        entityName: '',
        phone: '',
      });
    const [isAuthorised, setIsAuthorised] = useState("")
    const [errors, setErrors] = useState({});
    let params = useParams()

    useEffect(() => {
        
        async function fetchData()  {
            const res = await fetch(`https://cpa-flask.azurewebsites.net/settings/manager/'${params.userID}'`)
            const data = await res.json()

            console.log(data)

            setInputValue('userName',data.userName)  
            setInputValue('password',data.password)  
            setInputValue('email',data.email)  
            setInputValue('lastName',data.lastName)  
            setInputValue('firstName',data.firstName)  
            setInputValue('address',data.address)  
            setInputValue('suburb',data.suburb)  
            setInputValue('contactMethod',data.contactMethod)  
            setInputValue('businessName',data.businessName)  
            setInputValue('entityName',data.entityName)  
            setInputValue('phone',data.phone) 
        } 
            
        fetchData()

    },[params.userID])

    const InfoLog = async (information) => {
        setIsLoading(true)
       
            const res = await fetch(
                `https://cpa-flask.azurewebsites.net/settings/manager/update/'${sessionStorage.getItem('userID')}'/'${getInputValue('userName')}'/'${getInputValue('password')}'/'${getInputValue('firstName')}'/'${getInputValue('lastName')}'/'${getInputValue('email')}'/'${getInputValue('phone')}'/'${getInputValue('address')}'/'${getInputValue('suburb')}'/'${getInputValue('contactMethod')}'/'${getInputValue('businessName')}'/'${getInputValue('entityName')}'`
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
        
        console.log(event)
        const newErrors = {};
       
          if (!event.target[0].value) {
            newErrors.userName = 'Username cannot be empty';
          } else {
            const userNamePattern = /^[a-zA-Z0-9]{1,30}$/
            if (!userNamePattern.test(event.target[0].value)) {
              newErrors.userName = 'Username must be valid';
                }
            }
            if (!event.target[1].value) {
              newErrors.password = 'Password cannot be empty';
              } else {
                const passwordPattern = /^[a-zA-Z0-9 ]{1,30}$/
                if (!passwordPattern.test(event.target[1].value)) {
                  newErrors.password = 'Password valid';
                    }
                }
                if (!event.target[2].value) {
                  newErrors.firstName = 'First name cannot be empty';
              } else {
                const firstNamePattern = /^[A-Za-z]*$/
                if (!firstNamePattern.test(event.target[2].value)) {
                  newErrors.firstName = 'First name must be valid';
                    }
                }
              if (!event.target[3].value) {
                  newErrors.lastName = 'Last name cannot be empty';
              } else {
                const lastNamePattern = /^[A-Za-z]*$/
                if (!lastNamePattern.test(event.target[3].value)) {
                  newErrors.lastName = 'Last name must be valid';
                    }
                }
            if (!event.target[4].value) {
              newErrors.email = 'Email cannot be empty';
            } else {
              const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
              if (!emailPattern.test(event.target[4].value)) {
                newErrors.email = 'Email address must be valid';
                  }
              }
            if (!event.target[5].value) {
              newErrors.phone = 'Phone cannot be empty';
            } else {
              const phonePattern = /^[+#]?\d{1,13}$/
              if (!phonePattern.test(event.target[5].value)) {
                newErrors.phone = 'Phone must be valid';
                  }
              }
          if (!event.target[6].value) {
            newErrors.contactMethod = 'Contact method cannot be empty';
          }
          if (!event.target[7].value) {
                newErrors.address = 'Address cannot be empty';
              } else {
                const addressPattern = /^[a-zA-Z0-9 ]*$/
                if (!addressPattern.test(event.target[7].value)) {
                  newErrors.address = 'Address must be valid';
                    }
                }
          if (!event.target[8].value) {
            newErrors.businessName = 'Business name cannot be empty';
          } else {
            const businessNamePattern = /^[a-zA-Z0-9 ]*$/
            if (!businessNamePattern.test(event.target[8].value)) {
              newErrors.businessName = 'Business name must be valid';
                }
              }
              if (!event.target[9].value) {
                newErrors.suburb = 'Business Suburb/City cannot be empty';
              } else {
                const suburbPattern = /^[a-zA-Z ]*$/
                if (!suburbPattern.test(event.target[9].value)) {
                  newErrors.suburb = 'Business suburb must be valid';
                    }
                }
          if (!event.target[10].value) {
            newErrors.entityName = 'Entity name cannot be empty';
          } else {
            const entityNamePattern = /^[a-zA-Z0-9 ]*$/
            if (!entityNamePattern.test(event.target[10].value)) {
              newErrors.entityName = 'Entity name must be valid';
                }
              }
              
                
      
        setErrors(newErrors);
      
        if (Object.keys(newErrors).length > 0) {
          return;
        }
      
        InfoLog(event);
      };
      
    
  return (
    <Form onSubmit={handleSubmit} >        
         <div className={isAuthorised} id="field-align-colour">
            <h1>Manager Settings</h1>
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
            <p>Contact Method For Employees:</p>
            <select 
            value={getInputValue('contactMethod')} 
            onChange={(e) => setInputValue('contactMethod', e.target.value)}>
                <option value="">Select</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
            </select>{errors.contactMethod && <h6>{errors.contactMethod}</h6>}
            <p>Business Address:</p>
              <input 
                onChange={(e) => setInputValue('address', e.target.value)}
                type="text"
                placeholder="Address..." 
                value={getInputValue('address')}
            />{errors.address && <h6>{errors.address}</h6>}
            <p>Business Name:</p>
              <input 
                onChange={(e) => setInputValue('businessName', e.target.value)}
                type="text"
                placeholder="Business Name..." 
                value={getInputValue('businessName')}
            />{errors.businessName && <h6>{errors.businessName}</h6>}
            <p>Business Suburb/City:</p>
              <input 
                onChange={(e) => setInputValue('suburb', e.target.value)}
                type="text"
                placeholder="Business Suburb/City..." 
                value={getInputValue('suburb')}
            />{errors.suburb && <h6>{errors.suburb}</h6>}
            <p>Entity Name:</p>
              <input 
                onChange={(e) => setInputValue('entityName', e.target.value)}
                type="text"
                placeholder="Entity Name..." 
                value={getInputValue('entityName')}
            />{errors.entityName && <h6>{errors.entityName}</h6>}
            <br></br><br></br>
            </div>
            <button type="submit">Save</button>
            {isLoading ? <Loading className="Show"/> : <Loading className="Hide"/> }
    </Form>
  )
}
const Form = styled.form`
    display: flex;
    justify-self: center;
    width: 40%;
    flex-direction: column;
    height: fit-content;
    background: #dfdddd;
    border: 4px solid black;
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
        width: 50%;
        min-width: fit-content;
        max-width: 100%;
        text-align: center;
    }
    select {
        width: 50%;
        min-width: fit-content;
        max-width: 100%;
        text-align: center;
    }
    h1 {
        text-align:center;
        font-weight:400;
    }
    .Show {
      visibility: visible;
    }
  .Hide {
    visibility: hidden;
  }
 #field-align-colour {
  display: flex;
  flex-direction: column;
  align-items: center;
 }

 button {
  width: 3rem;
  align-self: center}
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

export default ManagerSettingsForm