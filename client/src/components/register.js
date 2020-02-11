import React, { useRef, useState, useEffect } from 'react'

function Register (props) {
    //const [apiResponse, setApiResponse] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [inputName, setInputName] = useState("");
    const [inputPass, setinputPass] = useState("");
    const [userToSave, setuserToSave] = useState({ 
      username: "", 
      password: "",
      email: ""  
    }); 
   
    const firstRenderSubmit = useRef(false);

    const handleEmailChange = (event) => { setInputEmail(event.target.value); }
    const handleNameChange = (event) => { setInputName(event.target.value); }
    const handlePassChange = (event) => { setinputPass(event.target.value); }

   
    const saveUser = (event)  => {
        event.preventDefault();
        setuserToSave({ username: inputName, password: inputPass, email: inputEmail });
        setInputEmail("");
        setInputName("");
        setinputPass(""); 
    }

    const toBackend = () => {
      let data = userToSave;
      //console.log(data);
      fetch('http://localhost:9000/register', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.text())
      .then((data) => {
        console.log('Success:', data);
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
    

     
     
      return (
        <div>
          <form onSubmit={saveUser}>
            <input type="text" value={inputEmail} onChange = {handleEmailChange} placeholder="Email" /> <br />
            <input type="text" value={inputName} onChange = {handleNameChange} placeholder="Username" /> <br />
            <input type="password" value={inputPass} onChange = {handlePassChange} placeholder="Password" /> <br />
            <input type="submit" value="Register" />
          </form>
        </div>
        );
      
    }
    


export default Register;