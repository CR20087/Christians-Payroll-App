import styled from "styled-components"
import EmployeeTable from "../Components/ManagerEmployeeView.tsx"
import SideBar from "../Components/Sidebar"

function EmployeeView() {
  return (
    <Page>
        <SideBar/>
        <Container>
            <EmployeeTable/>
        </Container>
    </Page>
  )
}

const Page = styled.div`
display: grid;
`

const Container = styled.div`
display: flex;
height: fit-content;
width: 50%;
justify-self: center;
align-items:center;

div {
    button {
        :hover {
        height:3rem;
        }
    }
}
`

export default EmployeeView