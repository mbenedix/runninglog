import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/auth';

function Profile (props) {
  
  const [name, setName] = useState();
  const [nameInput, setNameInput] = useState('');
  const [resStatus, setResStatus] = useState('');
  var [runs, setRuns] = useState('');
    
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

  const stripTime = (runs) => {
    if(runs !== undefined){
      runs.forEach(run => { run.date = run.date.split("T")[0]; });
    }
    return runs;
  }

  const addPace = (runs) => {
    if(firstRenderSubmit.current){
      runs = runs.map(run => ({...run, pace: Math.round(run.time/run.distance)}));
    }
  
    return runs;
  }

  const convFromSecs = (secs) => {
    let hours = 0;
    let mins = 0;
    while(secs >= 3600) {
      hours++;
      secs -= 3600;
    }

    while(secs >= 60) {
      mins++; 
      secs -= 60; 
    }
    hours = String(hours).padStart(2,'0');
    mins = String(mins).padStart(2,'0');
    secs = String(secs).padStart(2,'0');

    return hours + ":" + mins + ":" + secs;

  }

  const formatNumbers = (runs) => {
    if(runs !== undefined){
      runs.forEach(run => { 
        run.time = convFromSecs(run.time);
        run.pace = convFromSecs(run.pace);
      });
    }
    return runs;
  }
  
  
  let fullRuns = Array.from(runs); 
  fullRuns = stripTime(fullRuns);
  fullRuns = addPace(fullRuns);
  fullRuns = formatNumbers(fullRuns);

     const showRuns = (runs) => {
          if (runs === ''){
            return;
          }
          else if(runs.length === 0) {
            return "You have no runs to display"
          }
        
          else  {
            
            let runChart = [];
            if(resStatus === 200) {
              
              runChart = runs.map((run, i) => <div key={i}> <strong>Date:</strong> {run.date} Time: {run.time} Distance: {run.distance} Pace: {run.pace} Run Type: {run.runType}  </div>);
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

            {showRuns(fullRuns)}

          </div>
        );
    
}


export default Profile;