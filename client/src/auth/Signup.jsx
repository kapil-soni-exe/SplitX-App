import React from 'react'
import Input from '../components/comman/Input'
import Button from '../components/comman/Button'
import {Link} from "react-router-dom"

function Signup() {
  return (
    <div className="login-content">
            <div className="login-heading">
                <h1>Create your account</h1>
                <p>Start splitting expenses with ease</p>
            </div>

            <form action="" className="form-fields">
                <Input id="name" type='text' label="Full Name" placeholder='Enter your name'/>


                <Input id="email" type='email' label="Email" placeholder='Enter your email'/> 
                <Input id="password" type='password' label="Password" placeholder='Enter your password'/>
               
               <Button text='Create Accont' variant='primary' className='auth-submit'/>
            </form>

            <p className='auth-switch'>
                Already have an accont? <span><Link to="/login">Login</Link></span>
            </p>
        </div>
   
  )
}

export default Signup