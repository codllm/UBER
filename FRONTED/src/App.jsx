import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Start from './pages/Start'
import Home from './pages/home'
import UserLogin from './pages/userLogin'
import UserSign from './pages/userSign'
import CaptionLogin from './pages/captionLogin'
import CaptionSign from './pages/captionSign'
import UserProtectWrapper from './pages/UserProtectWrapper'
import Userlogout from './pages/Userlogout'

import CaptionHome from './pages/captionHome'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />

        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-sign" element={<UserSign />} />

        <Route path="/caption-login" element={<CaptionLogin />} />
        <Route path="/caption-sign" element={<CaptionSign />} />
        <Route path='/home' element={<UserProtectWrapper><Home />
          </UserProtectWrapper>
        } />

        <Route path="/user/logout" element={
          <UserProtectWrapper><Userlogout />
            </UserProtectWrapper>
        } />

        <Route path='/caption-home' element={<CaptionHome />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
