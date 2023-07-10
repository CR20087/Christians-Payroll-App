import styled from "styled-components"
import EmployeeSettingsForm from "../Components/EmployeeSettings"
import SideBar from "../Components/Sidebar"

function EmployeeSettings() {
  return (
    <Page>
        <SideBar/>
        <EmployeeSettingsForm/>
    </Page>
  )
}

const Page = styled.div`
display: grid;
`

export default EmployeeSettings