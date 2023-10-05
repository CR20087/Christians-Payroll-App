import styled from "styled-components"
import ManagerSettingsForm from "../Components/ManagerSettings"
import SideBar from "../Components/Sidebar"
import Footer from "../Components/Footer"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "../Components/Loading"
import Cookies from 'js-cookie';

function ManagerSettings() {

  let params = useParams()
  const [authenticated,setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {

    async function validate_auth() {

      //Authentication Process

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
        console.log(data)
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
        <ManagerSettingsForm/>
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

export default ManagerSettings