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
    </Routes>
  );
}


export default Pages