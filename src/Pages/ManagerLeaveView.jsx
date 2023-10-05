import LeaveView from '../Components/ManagerLeaveView.tsx'
import SideBar from "../Components/Sidebar"
import styled from 'styled-components'
import Footer from '../Components/Footer.jsx'
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "../Components/Loading"
import Cookies from 'js-cookie';

function ManagerLeave() {

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
            <Container>
                <LeaveView/>
            </Container>
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
    
const Container = styled.div`
    .css-80pr5n-MuiPaper-root {width:70vw;} //Table length
    .css-1hhu9xl {width:70vw;} //Table length -- Vercel
    display: flex;
    height:fit-content;
    justify-self:center;
    padding-top: 5rem;
`

export default ManagerLeave