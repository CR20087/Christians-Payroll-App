import styled from "styled-components"
import EmployeeSettingsForm from "../Components/EmployeeSettings"
import SideBar from "../Components/Sidebar"
import Footer from "../Components/Footer"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "../Components/Loading"
import Cookies from 'js-cookie';
function EmployeeSettings() {

  let params = useParams()
  const [authenticated,setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {

    //Authentication Process

    async function validate_auth() {
      try {
        const auth_key = Cookies.get('auth_key');
    const res = await fetch(`https://cpa-flask.azurewebsites.net/protected/resource`, {
      method: 'POST', // Use POST method
      body: JSON.stringify({ username: params.userID, auth_key: auth_key}),
      headers: {
          'Content-Type': 'application/json'
      }
  })
    const data = await res.json()
    if (data.status === 'True') {
      setAuthenticated(true)
    }
    if (data.status === 'False') {
      setAuthenticated(false)
      if (window.location.pathname !== '/login') {
      alert("Invalid Authentication Token.\nPlease login again.")
      navigate('/login')}
    }
      }
    catch {
      setAuthenticated(false)
      if (window.location.pathname !== '/login') {
      alert("Invalid Authentication Token.\nPlease login again.")
      navigate('/login')}
    }
    }

    validate_auth()
  },[])

  //Page

  return (
    <Page>
      {authenticated ?
            <>
        <SideBar/>
        <EmployeeSettingsForm/>
        <Footer/>
        </>
    : <><Loading/><Footer/></> }
    </Page>
  )
}

//Styling

const Page = styled.div`
display: grid;
`

export default EmployeeSettings