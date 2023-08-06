import LeaveView from '../Components/ManagerLeaveView.tsx'
import SideBar from "../Components/Sidebar"
import styled from 'styled-components'
import Footer from '../Components/Footer.jsx'
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "../Components/Loading"
function ManagerLeave() {

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
            <Container>
                <LeaveView/>
            </Container>
            <Footer/>
            </>
    : <><Loading/><Footer/></> }
        </Page>
      )
    }
    
const Page = styled.div`
    display: grid;
`
    
const Container = styled.div`
    .css-80pr5n-MuiPaper-root {width:70vw;}
    .css-1hhu9xl {width:70vw;}
    display: flex;
    height:fit-content;
    justify-self:center;
    padding-top: 5rem;
`

export default ManagerLeave