import React, { useRef, useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/auth';

function Output (props) {
  
  const [name, setName] = useState();
  const [nameInput, setNameInput] = useState('');
  const [resStatus, setResStatus] = useState('');
  const [person, setPerson] = useState({favoriteFoods: []});
    
  const firstRenderSubmit = useRef(false); // makes useEffect not fire on first render

  const auth = useAuth();

  //console.log(useContext(AuthContext));

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
            'authorization': 'Bearer ' + auth.JWT
           //'authorization': 'Bearer ' + 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.ZW1pbHk.qWMe2m_eLltq6Zjmr5hIPUgoJxUFYz_O4XOHHpEW8mKj0HUFMegqereJ1nYge0zDDKEYGnWICV6M0_g03QPYZg'
          },
          body: JSON.stringify({name: targetName}),
          })
          .then((response) => {
            setResStatus(response.status);
            return response.json()
          })
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
            let foods = "";
            if(resStatus === 200) {
              foods = person.favoriteFoods.map((x, i) => <h3 key={i}> {x} </h3>);
            }
            
            return (
                <div>
                {<h1>{auth.JWT}</h1>}
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