import React, { useEffect, useRef, useState } from 'react';
import './Login.css';
import {Navigate} from 'react-router-dom';

export const Login = () => {
  const signUpButton = useRef(null);
  const signInButton = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    signUpButton.current.addEventListener('click', () => {
      container.current.classList.add("right-panel-active");
    });

    signInButton.current.addEventListener('click', () => {
      container.current.classList.remove("right-panel-active");
    });
  }, []);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');

  async function register(e){
    e.preventDefault();
    const response = await fetch('http://localhost:9000/register',{
      method:'POST',
      body:JSON.stringify({username,password}),
      headers:{'Content-Type':'Application/json'}
    });
    if(response.status === 200){
      alert('Registration Successul');
    }
    else{
      alert('Registraton Failed')
      console.log(response);
    }
  }
const [redirect, setRedirect] = useState(false);
  async function login(e){
    e.preventDefault();
    const response = await fetch('http://localhost:9000/login',{
      method:'POST',
      body:JSON.stringify({username,password}),
      headers:{'Content-Type':'Application/json'},
      credentials:'include',
    });
  if(response.ok){
    setRedirect(true);
  }
  else{
    alert('Wrong Credentials');
  }
}
if(redirect){
  return <Navigate to={'/'}/>
}

  return (
    <div className="loginbody">
      <div className="container" id="container" ref={container}>
        <div className="form-container sign-up-container">
          <form onSubmit={register}>
            <h1 className='h1'>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g" />
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
            <span className='span'>or use your email for registration</span>
            <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
            <div className="sign">
            <button className='signbutton'>Sign Up</button>
            </div>
          </form>



        </div>
        <div className="form-container sign-in-container">



          <form onSubmit={login}>
            <h1 className='h1'>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g" />
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
            <span className='span'>or use your account</span>
            <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <a href="#">Forgot your password?</a>
            <button>Sign In</button>
          </form>



        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className='h1'>Welcome Back!</h1>
              <p className='p'>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn" ref={signInButton}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className='h1'>Hello, Friend!</h1>
              <p className='p'>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp" ref={signUpButton}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

  );
};
