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
.css-80pr5n-MuiPaper-root {width:70vw;}
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