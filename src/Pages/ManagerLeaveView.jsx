import React from 'react'
import LeaveView from '../Components/ManagerLeaveView.tsx'
import SideBar from "../Components/Sidebar"
import styled from 'styled-components'
import Footer from '../Components/Footer.jsx'
function ManagerLeave() {

    return (
        <Page>
            <SideBar/>
            <Container>
                <LeaveView/>
            </Container>
            <Footer/>
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