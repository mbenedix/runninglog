import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/auth';

function Profile (props) {
  
  const [name, setName] = useState();
  const [nameInput, setNameInput] = useState('');
  const [resStatus, setResStatus] = useState('');
  const [runs, setRuns] = useState([]);
    
  const firstRenderSubmit = useRef(false); // makes useEffect not fire on first render

  const auth = useAuth();

  
  const saveName = (event) => { 
    event.preventDefault();
    setName(nameInput);
    setNameInput("");
    
  }

  const toBackend = useCallback(() => {
    let targetName = name;
    console.log(targetName);
    
    fetch('http://localhost:9000/getruns', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + auth.JWT
      },
      body: JSON.stringify({name: targetName}),
      })
      .then((response) => {
        setResStatus(response.status);
        return response.json()
      })
      .then((data) => {
        console.log('Success:', data);
        setRuns(data);
        //setPerson(data);
       
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [name, auth.JWT] );

  useEffect(() => {
    if (firstRenderSubmit.current){
      toBackend()
    }
    else {
      firstRenderSubmit.current = true;
    }
  }, [toBackend]);

  
  
   

     const showRuns = () => {
          if(runs === []) {
            return "You have no runs to log"
          }

          else  {
            let runChart = [];
            if(resStatus === 200) {
              runChart = runs.map((run, i) => <h3 key={i}> Date: {run.date} Time: {run.time} Distance: {run.distance} Run Type: {run.runType}  </h3>);
            }
            
            return (
                <div>
                {runChart}
                </div>

              );
          }        
      }

    
        return (
            <div>
            <form onSubmit={saveName}>
              <input type="text" value={nameInput} onChange = { (e) => setNameInput(e.target.value) } placeholder="name" /> <br />
              <input type="submit" value= "Find Person" />
            </form>

            {showRuns()}

          </div>
        );
    
}


export default Profile;