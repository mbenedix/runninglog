import React, { useRef, useState, useEffect } from 'react'

function Input (props) {
    const [apiResponse, setApiResponse] = useState("");
    const [inputName, setInputName] = useState("");
    const [inputAge, setInputAge] = useState("");
    const [personToSave, setPersonToSave] = useState({ name: "", age: "" }); 
   
    const firstRenderSubmit = useRef(false);

    const handleNameChange = (event) => { setInputName(event.target.value); }
    const handleAgeChange = (event) => { setInputAge(event.target.value); }

   
    const savePerson = (event)  => {
        event.preventDefault();
        setPersonToSave({ name: inputName, age: inputAge }); 
      }

      useEffect(() => {
        if (firstRenderSubmit.current){
          toBackend()
        }
        else {
          firstRenderSubmit.current = true;
        }
      }, [personToSave]);
    
    const toBackend = () => {
        let data = personToSave;
        console.log(data);
        fetch('http://localhost:9000/testapi', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          })
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }

     
     
      return (
        <div>
          <form onSubmit={savePerson}>
            <input type="text" value={inputName} onChange = {handleNameChange} placeholder="name" /> <br />
            <input type="text" value={inputAge} onChange = {handleAgeChange} placeholder="age" /> <br />
            <input type="submit" value="Save Person" />
          </form>
        </div>
        );
      
    }
    


export default Input;