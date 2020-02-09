import React, { useRef, useState, useEffect, useContext } from 'react'
import { useAuth } from '../context/auth';

function Login (props) {
    const [apiResponse, setApiResponse] = useState("");
    
    const [inputName, setInputName] = useState("");
    const [inputPass, setinputPass] = useState("");
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

    const toBackend = () => {
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
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
   
      useEffect(() => {
        if (firstRenderSubmit.current){
          toBackend()
        }
        else {
          firstRenderSubmit.current = true;
        }
      }, [userToSave]);
    /*
      useEffect(() => {
        if (firstRenderSubmit.current){
          console.log("changed");
        }
        else {
          firstRenderSubmit.current = true;
        }
      }, [apiResponse]);
*/
     const showresult = () => {
       return (<h1>{apiResponse}</h1>)
     }
     
      return (
        <div>
          <form onSubmit={saveUser}>
            <input type="text" value={inputName} onChange = {handleNameChange} placeholder="Username" /> <br />
            <input type="password" value={inputPass} onChange = {handlePassChange} placeholder="Password" /> <br />
            <input type="submit" value="Login" /> <br/>

           { showresult()}
          </form>
        </div>
        );
      
    }
    


export default Login;