import { useState } from "react"
import styled from "styled-components"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Loading from "./Loading"
import bcrypt from 'bcryptjs';
import Cookies from 'js-cookie';

function EmployeeSettingsForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [inputValues, setInputValues] = useState({
        userName: '',
        password: '',
        email: '',
        lastName: '',
        firstName: '',
        address: '',
        suburb: '',
        postCode: '',
        phone: ''
      }); //Making default field values empty

    const [isAuthorised, setIsAuthorised] = useState("")
    const [errors, setErrors] = useState({});
    let params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        
        async function fetchData()  {

          //Fetching stored employee settings data
          const auth_key = Cookies.get('auth_key');
            const res = await fetch(`https://cpa-flask.azurewebsites.net/settings/employee`,{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({'username' : params.userID, auth_key : auth_key})
            })
            const data = await res.json()

            if (data.auth === false) {
              if (window.location.pathname !== '/login') {
              alert("Invalid Authentication Token.\nPlease login again.")
              navigate('/login')}
            }

            setInputValue('userName',data.userName);   
            setInputValue('password',''); Cookies.set('password',data.password)   
            setInputValue('email',data.email);   
            setInputValue('lastName',data.lastName);   
            setInputValue('firstName',data.firstName);   
            setInputValue('address',data.address);   
            setInputValue('suburb',data.suburb);   
            setInputValue('postCode',data.postCode);     
            setInputValue('phone',data.phone);
            
            //Setting the returned data to the relevant text field
        } 
            
        fetchData()

    },[params.userID])

    const InfoLog = async () => {

      //Function to send the update request, after input validation

        setIsLoading(true)

        const getPassword = async () => {
          if (!getInputValue('password')) {
            return Cookies.get('password')
        } else {
          return await bcrypt.hash(getInputValue('password'), 10);
        }}
            const hashedPassword = await getPassword()
            await hashedPassword
            const auth_key = Cookies.get('auth_key');
            const res = await fetch(
                `https://cpa-flask.azurewebsites.net/settings/employee/update`,{
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({auth_key : auth_key,
                'username_old' : params.userID,
                'username' : getInputValue('userName'),
                'password' : `'${hashedPassword}'`,
                'firstname' : `'${getInputValue('firstName')}'`,
                'lastname' : `'${getInputValue('lastName')}'`,
                'email' : `'${getInputValue('email')}'`,
                'phone' : `'${getInputValue('phone')}'`,
                'address' : `'${getInputValue('address')}'`,
                'suburb' : `'${getInputValue('suburb')}'`,
                'postcode' : `'${getInputValue('postCode')}'`
                })
                }
                )
            const data = await res.json()
            
            if (data.auth === false) {
              if (window.location.pathname !== '/login') {
              alert("Invalid Authentication Token.\nPlease login again.")
              navigate('/login')}
            }

            if (data.success === 'Success') {
              
              //If update was successful

                alert("Changes updated successfully")
                setIsAuthorised('border-green')
                sessionStorage.setItem('userID',getInputValue('userName'))
                Cookies.remove('password')
                Cookies.remove('auth_key')
                Cookies.set('auth_key',data.key)
                navigate(`/Portal/employee/${getInputValue('userName')}/settings`)
            } else {

              //If it was unsuccesful

                alert(`An error occured please check information and try again\n\n\n\n${data.error}`)
                setIsAuthorised('border-red')
            }

        setIsLoading(false)
    }

    
      const setInputValue = (fieldName, value) => {

        //Function used each time field is updated to update the stored value

        setInputValues((prevInputValues) => ({
          ...prevInputValues,
          [fieldName]: value,
        }));
      };
      
      const getInputValue = (fieldName) => {

        //Used to return a field value

        return inputValues[fieldName] || '';
      };
      
      const handleSubmit = (event) => {
        
        //Input Validation
        
        event.preventDefault()

        
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
            }
            else {const passwordPattern = /^[a-zA-Z0-9 ]{1,30}$/
              if (!passwordPattern.test(event.target[1].value)) {
                newErrors.password = 'Password must be valid';
                }}
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
          newErrors.address = 'Address cannot be empty';
        } else {
          const addressPattern = /^[a-zA-Z0-9 ]*$/
          if (!addressPattern.test(event.target[6].value)) {
            newErrors.address = 'Address must be valid';
              }
          }
        if (!event.target[7].value) {
          newErrors.postCode = 'Post Code cannot be empty';
        } else {
          const postCodePattern = /^\d{4}$/
          if (!postCodePattern.test(event.target[7].value)) {
            newErrors.postCode = 'Post code must be valid';
              }
          }
        if (!event.target[8].value) {
          newErrors.suburb = 'Business Suburb/City cannot be empty';
        } else {
          const suburbPattern = /^[a-zA-Z]*$/
          if (!suburbPattern.test(event.target[8].value)) {
            newErrors.suburb = 'Business suburb must be valid';
              }
          }
      
        setErrors(newErrors);
      
        if (!Object.keys(newErrors).length > 0) {
          InfoLog(); //Function which saves the information if the infomration is acceptable
        }
      };
      
    
  return (
    <Form onSubmit={handleSubmit} >        
         <div className={isAuthorised} id="field-align-colour">
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
            <button type="submit">Save</button>
            {isLoading ? <Loading className="Show"/> : <Loading className="Hide"/> }
    </Form>
  )
}

//Styling

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

export default EmployeeSettingsForm