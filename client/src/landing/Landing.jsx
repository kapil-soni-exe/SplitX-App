import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItsWork from './components/HowItsWork'
import Features from './components/Features'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import "./LandingPage.css";



function Landing() {
  return (
    <>
    <CustomCursor />
    <Navbar/>
    <Hero/>
    <HowItsWork/>
    <Features/>
    <Footer/>
    </>
  )
}

export default Landing