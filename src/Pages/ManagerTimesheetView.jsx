import styled from "styled-components"
import TimesheetView from "../Components/ManagerTimesheetView.tsx"
import SideBar from "../Components/Sidebar"
import Footer from "../Components/Footer.jsx"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "../Components/Loading"

function ManagerTimesheetView() {

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
        <Container>
            <TimesheetView/>
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

.title-details {
  text-decoration: underline wavy;
  font-size: 17px;
}
`


export default ManagerTimesheetView