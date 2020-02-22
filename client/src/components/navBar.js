import React from 'react'
import { useAuth } from '../context/auth';


function NavBar(props){

  const auth = useAuth();
  
  const logOut = () => {
    auth.setJWT("");
    localStorage.clear();
    
  }
  
  return (
    <div>
        <a href='/profile'>|| Profile |</a>
        <a href='/logrun'>| Log Run |</a>
        <a href='/register'>| Register |</a>
        <a href='/login'>| Login |</a>
        <a href='/login' onClick={logOut}>| Logout ||</a>


        <span>{auth.user}</span>

    </div>
    )
  }


export default NavBar