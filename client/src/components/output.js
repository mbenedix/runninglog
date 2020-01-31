import React, { Component ,useRef, useState, useEffect } from 'react'

function Output (props) {
  
  const [name, setName] = useState();
  const [nameInput, setNameInput] = useState('');
  const [person, setPerson] = useState({favoriteFoods: []});
    
  const firstRenderSubmit = useRef(false); // makes useEffect not fire on first render

  const handleNameChange = (event) => { setNameInput(event.target.value); }
  
  const saveName = (event) => { 
    event.preventDefault();
    console.log(person);
    setName(nameInput);
    setNameInput("");
    
  }
  useEffect(() => {
    if (firstRenderSubmit.current){
      toBackend()
    }
    else {
      firstRenderSubmit.current = true;
    }
  }, [name]);

  
  const toBackend = () => {
        let targetName = name;
        console.log(targetName);
        
        fetch('http://localhost:9000/findperson', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({name: targetName}),
          })
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);
            setPerson(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }


     const showPerson = () => {
          if(person === null) {
            return "person not found brooo"
          }

          else  {
            const foods = person.favoriteFoods.map((x, i) => <h3 key={i}> {x} </h3>)
            return (
                 <div>
                <h1>{person.name}</h1>
                <h2>{person.age}</h2>
                {foods}
                </div>

              );
          }        
      }

    
        return (
            <div>
            <form onSubmit={saveName}>
              <input type="text" value={nameInput} onChange = {handleNameChange} placeholder="name" /> <br />
              <input type="submit" value= "Find Person" />
            </form>

            {showPerson()}

          </div>
        );
    
}


export default Output;