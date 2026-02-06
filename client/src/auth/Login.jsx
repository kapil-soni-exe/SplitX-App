import React from 'react'
import Input from "../components/comman/Input"
import Button from '../components/comman/Button'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


function Login() {
  const navigate=useNavigate()
  const handleLogin=(e)=>{
    e.preventDefault()

    navigate("/dashboard")

  }  
  return (
    
        <div className="login-content">
            <div className="login-heading">
                <h1>Welcome back</h1>
                <p>Log in to manage your shared expenses</p>
            </div>

            <form onSubmit={handleLogin} className="form-fields">
                <Input id="password" type='email' label="Email" placeholder='Enter your email'/>
                <Input id="password" type='password' label="Password" placeholder='Enter your password'/>
               
               <Button text='Log in' type='submit' variant='primary' className='auth-submit'/>
            </form>

            <p className='auth-switch'>
                Don't have an accont? <span><Link to="/signup" >Create one</Link></span>
            </p>
        </div>
    
  )
}

export default Login