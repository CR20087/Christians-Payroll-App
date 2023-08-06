import styled from "styled-components"
import ManagerSettingsForm from "../Components/ManagerSettings"
import SideBar from "../Components/Sidebar"
import Footer from "../Components/Footer"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "../Components/Loading"

function ManagerSettings() {

  let params = useParams()
  const [authenticated,setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {

    async function validate_auth() {
      try {
    const res = await fetch(`https://cpa-flask.azurewebsites.net/auth/validate/'${params.userID}'/${sessionStorage.getItem('authKey')}`)
    const data = await res.json()

    if (data.match === 'true') {
      setAuthenticated(true)
    }
    if (data.match === 'false') {
      setAuthenticated(false)
      if (window.location.pathname !== '/login') {
      alert("Invalid Authentication Token.\nPlease login agian.")
      navigate('/login')}
    }
      }
    catch {
      setAuthenticated(false)
      if (window.location.pathname !== '/login') {
      alert("Invalid Authentication Token.\nPlease login agian.")
      navigate('/login')}
    }
    }

    validate_auth()
  },[])

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

const Page = styled.div`
display: grid;
`

export default ManagerSettings