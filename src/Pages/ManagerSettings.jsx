import styled from "styled-components"
import ManagerSettingsForm from "../Components/ManagerSettings"
import SideBar from "../Components/Sidebar"
import Footer from "../Components/Footer"

function ManagerSettings() {
  return (
    <Page>
        <SideBar/>
        <ManagerSettingsForm/>
        <Footer/>
    </Page>
  )
}

const Page = styled.div`
display: grid;
`

export default ManagerSettings