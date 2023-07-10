import styled from "styled-components"
import ManagerSettingsForm from "../Components/ManagerSettings"
import SideBar from "../Components/Sidebar"

function ManagerSettings() {
  return (
    <Page>
        <SideBar/>
        <ManagerSettingsForm/>
    </Page>
  )
}

const Page = styled.div`
display: grid;
`

export default ManagerSettings