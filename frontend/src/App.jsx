// import { useState } from 'react'
import SignUpComponent from './components/SignUpComponent'
import './App.css'
import { Routes, Route } from 'react-router-dom'

function App() {
  

  return (
    <>
    <Routes>
      <Route path="/sign-up" element={<SignUpComponent />} />
      </Routes>
      </>
  )
}

export default App
