import styled from "styled-components"
import EmployeeSettingsForm from "../Components/EmployeeSettings"
import SideBar from "../Components/Sidebar"
import Footer from "../Components/Footer"

function EmployeeSettings() {
  return (
    <Page>
        <SideBar/>
        <EmployeeSettingsForm/>
        <Footer/>
    </Page>
  )
}

const Page = styled.div`
display: grid;
`

export default EmployeeSettings