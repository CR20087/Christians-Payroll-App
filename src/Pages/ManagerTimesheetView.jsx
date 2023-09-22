import styled from "styled-components"
import TimesheetView from "../Components/ManagerTimesheetView.tsx"
import SideBar from "../Components/Sidebar"
import Footer from "../Components/Footer.jsx"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "../Components/Loading"

function ManagerTimesheetView() {

  let params = useParams()
  const [authenticated,setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {

    async function validate_auth() {

      //Authentication Process

      try {
    const res = await fetch(`https://cpa-flask.azurewebsites.net/auth/validate`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'username' : `'${params.userID}'`,'auth_key' : `${sessionStorage.getItem('authKey')}`
    })
})
    const data = await res.json()

    if (data.match === 'true') {
      setAuthenticated(true)
    }
    if (data.match === 'false') {
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
            <TimesheetView/>
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

.title-details { //Entry list (in dropdown view)
  text-decoration: underline;
  font-size: 17px;
}
`


export default ManagerTimesheetView