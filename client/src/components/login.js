import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../context/auth';
import { Redirect } from 'react-router-dom'
function Login (props) {
    const [apiResponse, setApiResponse] = useState("");
    
    const [inputName, setInputName] = useState("");
    const [inputPass, setinputPass] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [userToSave, setuserToSave] = useState({ 
      username: "", 
      password: "",
    }); 
   
    const firstRenderSubmit = useRef(false);
    
    const auth = useAuth();

    const handleNameChange = (event) => { setInputName(event.target.value); }
    const handlePassChange = (event) => { setinputPass(event.target.value); }

   
    const saveUser = (event)  => {
        event.preventDefault();
        setuserToSave({ username: inputName, password: inputPass});

        setInputName("");
        setinputPass(""); 
    }

  
    
   
      useEffect(() => {
        if (firstRenderSubmit.current) {
          let data = userToSave;
          //console.log(data);
          fetch('http://localhost:9000/login', {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          .then((response) => response.text())
          .then((data) => {
            console.log('Success:', data);
            if(data === "1") {
              setApiResponse("Username not found. Please register.");
            }
            else if(data === "2") {
              setApiResponse("Incorrect password. Please try again.");
            }
            else {
              auth.setJWT(data);
              auth.setUser(userToSave.username);
              setLoggedIn(true);
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        }

        else {
          firstRenderSubmit.current = true;
        }
      /*adding auth as dependency causes bug which makes this effect fire twice
        since the effect updates auth by design*/
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [userToSave]);

     const showresult = () => {
       return (<h1>{apiResponse}</h1>)
     }

     const redirect = () => 
     {
       if(loggedIn) {
         return (<Redirect to='/output' />)
       }
     }
      return (
        
        <div>
          <h1>Login</h1>
          <form onSubmit={saveUser}>
            <input type="text" value={inputName} onChange = {handleNameChange} placeholder="Username" /> <br />
            <input type="password" value={inputPass} onChange = {handlePassChange} placeholder="Password" /> <br />
            <input type="submit" value="Login" /> <br/>

          { showresult() }
          { redirect() }
          </form>
        </div>
        );
      
    }

export default Login;