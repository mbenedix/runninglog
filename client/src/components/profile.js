import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/auth';

function Profile (props) {
  
  const [sortVal, setSortVal] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [sortObj, setSortObj] = useState({val: "date", dir: "desc"});
  const [resStatus, setResStatus] = useState('');
  var [runs, setRuns] = useState('');
    
  const firstRenderSubmit = useRef(false); // makes useEffect not fire on first render

  const auth = useAuth();

  
  const saveForm = (event) => { 
    event.preventDefault();
    setSortObj({val: sortVal, dir: sortDir});
    
  }

  const toBackend = useCallback(() => {
    let targetName = "doggo";    
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
  }, [sortObj, auth.JWT] );

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
        run.formTime = convFromSecs(run.time);
        run.formPace = convFromSecs(run.pace);
      });
    }
    return runs;
  }
  
  const sortRuns = (sortObj, runs) => { //need to make useeffects
    switch(sortObj.val) {
      case "date":
        runs.sort((a,b) => (a.date > b.date) ? 1 : -1);
        break;
      case "time":
        runs.sort((a,b) => (a.time > b.time) ? 1 : -1);
        break;
      case "distance":
        runs.sort((a,b) => (a.distance > b.distance) ? 1 : -1);
        break;
      case "pace":
        runs.sort((a,b) => (a.pace > b.pace) ? 1 : -1);
        break;
      default:
        return runs;
      
    }

    if(sortObj.dir === "desc") {
      runs.reverse();
    }

    return runs;

  }
  
  let fullRuns = Array.from(runs); 
  fullRuns = stripTime(fullRuns);
  fullRuns = addPace(fullRuns);
  fullRuns = formatNumbers(fullRuns);
  console.log(sortObj);
  fullRuns = sortRuns(sortObj, fullRuns);

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
              
              runChart = runs.map((run, i) => <div key={i}> <strong>Date:</strong> {run.date} Time: {run.formTime} Distance: {run.distance} Pace: {run.formPace} Run Type: {run.runType}  </div>);
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
            <form onSubmit={saveForm}>
              <select value={sortDir} onChange={ (e) => setSortDir(e.target.value) }>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
                
              </select>
              <select value={sortVal} onChange={ (e) => setSortVal(e.target.value) }>
                <option value="date">Date</option>
                <option value="time">Time</option>
                <option value="distance">Distance</option>
                <option value="pace">Pace</option>
              </select>
              <input type="submit" value= "Sort" />
            </form>

            { showRuns(fullRuns) } 

          </div>
        );
    
}


export default Profile;