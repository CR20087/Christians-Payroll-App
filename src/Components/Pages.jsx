import React from 'react'
import Landing from '../Pages/Landing'
import { Route, Routes, useLocation } from 'react-router-dom';
import Login from '../Pages/Login'
import Support from '../Pages/Support';
import Portal from '../Pages/Portal';

function Pages() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/support" element={<Support/>} />
        <Route path="/Portal/:userID" element={<Portal/>} />
    </Routes>
  );
}


export default Pages