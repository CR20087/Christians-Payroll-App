import React from 'react'
import Landing from '../Pages/Landing'
import { Route, Routes, useLocation } from 'react-router-dom';
import Login from '../Pages/Login'
import Support from '../Pages/Support';
import EmployeePortal from '../Pages/EmployeePortal';
import ManagerPortal from '../Pages/ManagerPortal';
import ManagerSettings from '../Pages/ManagerSettings';
import Register from '../Pages/Register';
import ManagerRegister from '../Pages//ManagerRegister';
import EmployeeSettings from '../Pages/EmployeeSettings';
import EmployeeTimesheets from '../Pages/EmployeeTimesheets';
import EmployeeView from '../Pages/ManagerEmployeeView';
import EmployeeLeave from '../Pages/EmployeeLeave';
import ManagerTimesheetView from '../Pages/ManagerTimesheetView'
import ManagerLeaveView from '../Pages/ManagerLeaveView'
import ManagerPayRun from '../Pages/ManagerPayRun'

function Pages() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Support" element={<Support/>} />
        <Route path="/Portal/manager/:userID" element={<ManagerPortal/>} />
        <Route path="/Portal/manager/:userID/settings" element={<ManagerSettings/>} />
        <Route path="/Portal/employee/:userID/settings" element={<EmployeeSettings/>} />
        <Route path="/Portal/employee/:userID" element={<EmployeePortal/>} />
        <Route path="/Register/:pagenum" element={<Register/>} />
        <Route path="/Register/manager/:pagenum" element={<ManagerRegister/>} />
        <Route path="/Portal/employee/:userID/timesheets" element={<EmployeeTimesheets/>} />
        <Route path="/Portal/employee/" element={<EmployeeTimesheets/>} />
        <Route path="/Portal/manager/:userID/employee-view" element={<EmployeeView/>} />
        <Route path="/Portal/employee/:userID/leave" element={<EmployeeLeave/>} />
        <Route path="/Portal/manager/:userID/employee-timesheets" element={<ManagerTimesheetView/>} />
        <Route path="/Portal/manager/:userID/leave" element={<ManagerLeaveView/>} />
        <Route path="/Portal/manager/:userID/pay-run" element={<ManagerPayRun/>} />
    </Routes>
  );
}


export default Pages