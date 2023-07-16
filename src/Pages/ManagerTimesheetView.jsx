import styled from "styled-components"
import TimesheetView from "../Components/ManagerTimesheetView.tsx"
import SideBar from "../Components/Sidebar"
import Footer from "../Components/Footer.jsx"

function ManagerTimesheetView() {
  return (
    <Page>
        <SideBar/>
        <Container>
            <TimesheetView/>
        </Container>
        <Footer/>
    </Page>
  )
}

const Page = styled.div`
display: grid;
`

const Container = styled.div`
display: flex;
height:fit-content;
justify-self:center;
padding-top: 5rem;
`


export default ManagerTimesheetView