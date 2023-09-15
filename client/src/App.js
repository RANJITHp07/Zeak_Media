import React, { useEffect,useState } from 'react';
import Homepage from './Pages/Homepage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProfilePage from './Pages/ProfilePage';
import Loginpage from './Pages/Loginpage';
import Signinpage from './Pages/Signinpage';
import ForgetPassword from './Pages/forgetPassword';
import FriendProfilePage from './Pages/FriendsProfile';
import AdminPage from './Pages/adminPage';
import ChatPage from './Pages/chatPage';
import PostReportPage from './Pages/postReportPage';
import VerifyPage from './Pages/verifyPage';
import UserVerifyPage from './Pages/userVerifyPage';
import AdminLoginpage from './Pages/adminLoginPage';
import AdminSigninpage from './Pages/adminSigninPage';

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" name="home"   element={<Homepage />} />
        <Route path="/profile" name="profile" element={<ProfilePage />}/>
        <Route path="/user/:username" name="profile_username" element={ <FriendProfilePage/>}/>
        <Route path="/admin" name="admin" element={<AdminPage/>}/>
        <Route path="/login" name="login" element={  <Loginpage/>} />
        <Route path="/signin" name="signin" element={<Signinpage />} />
        <Route path="/forgetPassword" name="forgetpassword" element={<ForgetPassword />} />
        <Route path="/chat" name="chat" element={ <ChatPage/>} />
        <Route path="/post/report" name="report" element={<PostReportPage/>} />
        <Route path="/verifyuser" name="verify" element={<VerifyPage/>} />
        <Route path="/admin/login" name="adminverify" element={<AdminLoginpage/>} />
        <Route path="/admin/signin" name="adminverify" element={<AdminSigninpage/>} />
        <Route path="/admin/verifyuser" name="adminverify" element={<UserVerifyPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
