import styled from "styled-components"
import EmployeeSettingsForm from "../Components/EmployeeSettings"
import SideBar from "../Components/Sidebar"
import Footer from "../Components/Footer"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "../Components/Loading"

function EmployeeSettings() {

  let params = useParams()
  const [authenticated,setAuthenticated] = useState(false)

  useEffect(() => {

    async function validate_auth() {
    const res = await fetch(`https://cpa-flask.azurewebsites.net/auth/validate/'${params.userID}'/${sessionStorage.getItem('authKey')}`)
    const data = await res.json()

    console.log(data)

    if (data.match === 'true') {
      setAuthenticated(true)
    }
    if (data.match === 'false') {
      setAuthenticated(false)
    }
    }

    validate_auth()
  },[])

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

const Page = styled.div`
display: grid;
`

export default EmployeeSettings