import styled from "styled-components"
import EmployeeTable from "../Components/ManagerEmployeeView.tsx"
import SideBar from "../Components/Sidebar"
import Footer from "../Components/Footer.jsx"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "../Components/Loading"

function EmployeeView() {

    let params = useParams()
    const [authenticated,setAuthenticated] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {

      //Authentication Process

      async function validate_auth() {
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
            <EmployeeTable/>
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
.css-1hw9j7s { //Button colours -- Vercel
        background-color: #4d6788;
        :hover {
            background-color: #2d4965
        }}
.css-zcbmsk-MuiButtonBase-root-MuiButton-root { //Button colours
        background-color: #4d6788;
        :hover {
            background-color: #2d4965
        }}
.mui-box-container-form { //New employee form
    position: fixed;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 700;
    background-color:white;
    height: 60vh;
    padding-bottom: 10rem;

    .buttons-for-form {
        height: fit-content;
        padding-top: 3rem;
        float: right;
    }

}
.true { // Black background (active whislt modal is open)
    visibility: visible;
    position:fixed;
    top:0px;
    left: 0px;
    width:100%;
    height:100%;
    background-color:black;
    background-color: rgb(0,0,0,0.8);;
    z-index: 500;
}
.false {
        visibility: hidden;
}
display: flex;
height:fit-content;
justify-self:center;
padding-top: 5rem;
`


export default EmployeeView