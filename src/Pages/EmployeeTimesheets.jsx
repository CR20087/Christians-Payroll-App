import React from 'react'
import Timesheet from '../Components/Timesheet'
import SideBar from "../Components/Sidebar"
import styled from 'styled-components'
function EmployeeTimesheets() {

    return (
        <Page>
            <SideBar/>
            <Timesheet/>
        </Page>
      )
    }
    
    const Page = styled.div`
    display: grid;
    `
export default EmployeeTimesheets