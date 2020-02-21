import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/auth';

function Profile (props) {
  //controlled forms
  const [sortVal, setSortVal] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [sortObj, setSortObj] = useState({val: "date", dir: "desc"});
  const [filterObj, setFilterObj] = useState({dateDir: "all", aDate: "", bDate: "", timeDir: "all", timeVal: "", disDir: "all", disVal: "", paceDir: "all", paceVal: ""});
  const [dateDir, setDateDir] = useState('all');
  const [aDate, setADate] = useState('');
  const [bDate, setBDate] = useState('');
  const [timeDir, setTimeDir] = useState('all');
  const [timeVal, setTimeVal] = useState('');
  const [disDir, setDisDir] = useState('all');
  const [disVal, setDisVal] = useState('');
  const [paceDir, setPaceDir] = useState('all');
  const [paceVal, setPaceVal] = useState('');

  //rest of state
  const [resStatus, setResStatus] = useState('');
  const [parseStatus, setParseStatus] = useState('');
  const [runs, setRuns] = useState('');
  const [fullRuns, setFullRuns] = useState('');
    
  const firstRenderSubmit = useRef(false); // makes useEffect not fire on first render
  const auth = useAuth();

  
  const saveForm = (event) => { 
    event.preventDefault();
    setSortObj({val: sortVal, dir: sortDir});
    setFilterObj({dateDir, aDate, bDate, timeDir, timeVal, disDir, disVal, paceDir, paceVal});
    
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
        
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [auth.JWT] );

  useEffect(() => {
    if (!firstRenderSubmit.current){
      toBackend()
    }
    else {
      firstRenderSubmit.current = true;
    }
  }, [toBackend]);

  const stripTime = (runs) => {
    runs = Array.from(runs);
    runs.forEach(run => { run.date = run.date.split("T")[0]; });

    return runs;
  }

  const addPace = (runs) => {
    runs = Array.from(runs);
    runs = runs.map(run => ({...run, pace: Math.round(run.time/run.distance)}));
  
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
    runs = Array.from(runs);
    if(runs !== undefined){
      runs.forEach(run => { 
        run.formTime = convFromSecs(run.time);
        run.formPace = convFromSecs(run.pace);
      });
    }
    return runs;
  }
  
  const sortRuns = (sortObj, runs) => { 
    runs = Array.from(runs);
    
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

  

  useEffect(() => {

    if (runs !== "" && resStatus === 200){
      console.log("onetime parse fire");

      let tempRuns = runs; 
      tempRuns = stripTime(tempRuns);
      tempRuns = addPace(tempRuns);
      tempRuns = formatNumbers(tempRuns);
      setFullRuns(tempRuns);
      setParseStatus(true);
      
    }
    
  }, [auth.JWT, resStatus, runs]);

  useEffect(() => {
    if (resStatus === 200) {
      console.log("sort fire");
      setFullRuns(sortRuns(sortObj, fullRuns));
    }
    
  }, [sortObj, parseStatus, resStatus]);

  
  


  
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
              <h3>Sort By: </h3>
              <select value={sortVal} onChange={ (e) => setSortVal(e.target.value) }>
                <option value="date">Date</option>
                <option value="time">Time</option>
                <option value="distance">Distance</option>
                <option value="pace">Pace</option>
              </select>

              <select value={sortDir} onChange={ (e) => setSortDir(e.target.value) }>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
                
              </select> <br/>

              <h3>Include Runs: </h3>
              Date: 
              <select value={dateDir} onChange={ (e) => setDateDir(e.target.value) }>
                <option value="all">All</option>
                <option value="bet">Between</option>
              </select> 
              After: <input type="date" value={aDate} onChange = { (e) => setADate(e.target.value) } /> 
              Before: <input type="date" value={bDate} onChange = { (e) => setBDate(e.target.value) } /> 
              <br/>
              Time: 
              <select value={timeDir} onChange={ (e) => setTimeDir(e.target.value) }>
                <option value="all">All</option>
                <option value="gt">Longer than</option>
                <option value="lt">Less than</option>
              </select> 
              <input type="number" value={timeVal} onChange = { (e) => setTimeVal(e.target.value) } placeholder="Time"/> <br />
              Distance: 
              <select value={disDir} onChange={ (e) => setDisDir(e.target.value) }>
                <option value="all">All</option>
                <option value="gt">Longer than</option>
                <option value="lt">Less than</option>
              </select> 
              <input type="number" value={disVal} onChange = { (e) => setDisVal(e.target.value) } placeholder="Time"/> <br />
              Pace: 
              <select value={paceDir} onChange={ (e) => setPaceDir(e.target.value) }>
                <option value="all">All</option>
                <option value="gt">Longer than</option>
                <option value="lt">Less than</option>
              </select> 
              <input type="number" value={paceVal} onChange = { (e) => setPaceVal(e.target.value) } placeholder="Time"/> 
              <br/><br/><input type="submit" value= "Submit" />

            </form>
            <br/>
            { showRuns(fullRuns) } 
            {console.log(filterObj)}
          </div>
        );
    
}


export default Profile;