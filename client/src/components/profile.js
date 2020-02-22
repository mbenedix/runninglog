import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';

const convToSecs = (h, m, s) => (h*3600) + (m*60) + (s*1)

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

const timeFilter = (timeDir, timeVal, runs) => {
  if(timeDir === "gt") {
    return runs.filter(run => run.time > timeVal);
  }

  else if(timeDir === "lt") {
    return runs.filter(run => run.time < timeVal);
  }

  else {
    return runs;
  }
}

const distanceFilter = (disDir, disVal, runs) => {
  if(disDir === "gt") {
    return runs.filter(run => run.distance > disVal);
  }

  else if(disDir === "lt") {
    return runs.filter(run => run.distance < disVal);
  }

  else {
    return runs;
  }
}

const paceFilter = (paceDir, paceVal, runs) => {
  if(paceDir === "gt") {
    return runs.filter(run => run.pace > paceVal);
  }

  else if(paceDir === "lt") {
    return runs.filter(run => run.pace < paceVal);
  }

  else {
    return runs;
  }
}

const dateFilter = (dateDir, aDate, bDate, runs) => {
  if(dateDir === "bet") {
    if(aDate === '') {
      aDate = "1970-01-01";
    }

    if(bDate === '') {
      bDate = "2050-01-01";
    }
    return runs.filter(run => run.date > aDate && run.date < bDate);
    
  }

  else {
    return runs;
  }

}

const typeFilter = (runType, runs) => {
  if(runType !== "all") {
    return runs.filter(run => run.runType === runType);
  }

  else {
    return runs; 
  }
}

const filterRuns = (filterObj, runs) => { 
  runs = dateFilter(filterObj.dateDir, filterObj.aDate, filterObj.bDate, runs);
  runs = typeFilter(filterObj.runType, runs);
  runs = timeFilter(filterObj.timeDir, filterObj.timeVal, runs);
  runs = distanceFilter(filterObj.disDir, filterObj.disVal, runs);
  runs = paceFilter(filterObj.paceDir, filterObj.paceVal, runs);
  
  
  return runs; 

}

function Profile (props) {
  //controlled forms
  const [sortVal, setSortVal] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [sortObj, setSortObj] = useState({val: "date", dir: "desc"});
  const [filterObj, setFilterObj] = useState({dateDir: "all", aDate: "", bDate: "", timeDir: "all", timeVal: "", disDir: "all", disVal: "", paceDir: "all", paceVal: "", runType: "all"});
  const [dateDir, setDateDir] = useState('all');
  const [aDate, setADate] = useState('');
  const [bDate, setBDate] = useState('');
  const [timeDir, setTimeDir] = useState('all');
  const [timeVal, setTimeVal] = useState(0);
  const [mTimeVal, setMTimeVal] = useState(0);
  const [hTimeVal, setHTimeVal] = useState(0);
  const [disDir, setDisDir] = useState('all');
  const [disVal, setDisVal] = useState('');
  const [paceDir, setPaceDir] = useState('all');
  const [paceVal, setPaceVal] = useState(0);
  const [mPaceVal, setMPaceVal] = useState(0);
  const [runType, setRunType] = useState('all');

  //rest of state
  const [resStatus, setResStatus] = useState('');
  const [runs, setRuns] = useState('');
  const [fullRuns, setFullRuns] = useState('');
  const [displayRuns, setDisplayRuns] = useState('');
    
  //const firstRender = useRef(false); // makes useEffect not fire on first render
  const auth = useAuth();

  
  const saveForm = (e) => { 
    e.preventDefault();

    let timeSecs = convToSecs(hTimeVal, mTimeVal, timeVal);
    let paceSecs = convToSecs(0, mPaceVal, paceVal);

    setSortObj({val: sortVal, dir: sortDir});
    setFilterObj({dateDir, aDate, bDate, timeDir, timeVal: timeSecs, disDir, disVal, paceDir, paceVal: paceSecs, runType});
    
  }

  useEffect(() => {
      fetch('http://localhost:9000/getruns', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + auth.JWT
        },
      })
      .then((response) => {
        setResStatus(response.status);
        return response.json()  //dog.reduce((a,b) => {return (a+b.cat)}, 0)

      })
      .then((data) => {
        console.log('Success:', data);
        setRuns(data);
        
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, [auth.JWT]);


  
 

  useEffect(() => {

    if (runs !== "" && resStatus === 200){
      console.log("onetime parse fire");

      let tempRuns = runs; 
      tempRuns = addPace(tempRuns);
      tempRuns = formatNumbers(tempRuns);
      setFullRuns(tempRuns);
      
    }
    
  }, [auth.JWT, resStatus, runs]);

  useEffect(() => {
    if (resStatus === 200) {
      console.log("sort fire");

      let tempFullRuns = fullRuns;
      tempFullRuns = filterRuns(filterObj, tempFullRuns)
      
      tempFullRuns = sortRuns(sortObj, tempFullRuns);

      setDisplayRuns(tempFullRuns);
    }
    
  }, [sortObj, filterObj, fullRuns, resStatus]);

  
  
     const showRuns = (runs) => {
          if (runs === ''){
            return;
          }
          else if(runs.length === 0) {
            return "You have no runs to display"
          }
        
          else  {
            
            let runChart = [];
            let totalTime, formTotalTime, totalDistance, avgPace, avgTime, avgDistance;
            if(resStatus === 200) {
              totalTime = runs.reduce((acc, run) => {return acc + run.time}, 0);
              formTotalTime = convFromSecs(totalTime);
              totalDistance = runs.reduce((acc, run) => {return acc + run.distance}, 0);
              avgPace = convFromSecs(Math.round(totalTime/totalDistance));
              avgTime = convFromSecs(Math.round(totalTime/runs.length));
              avgDistance = (totalDistance/runs.length).toFixed(2);


              runChart = runs.map((run, i) => <div key={i}> <strong>Date:</strong> {run.date} Time: {run.formTime} Distance: {run.distance} Pace: {run.formPace} Run Type: {run.runType}  </div>);
            }
            
            return (
                <div>
                  <h3>Aggregate Statistics</h3>
                  <strong>Total Time:</strong> {formTotalTime} <span/>
                  <strong>Total Distance:</strong> {totalDistance} miles <br/>
                  <strong>Average Time:</strong> {avgTime} <span/>
                  <strong>Average Distance:</strong> {avgDistance} <span/>
                  <strong>Average Pace:</strong> {avgPace} <span/>


                  <h3>Runs</h3>
                  {runChart}
                </div>

              );
          }        
      }
    
        return (
            <div>
            <form onSubmit={saveForm}>

              <h3>Include Runs: </h3>
              Date: 
              <select value={dateDir} onChange={ (e) => setDateDir(e.target.value) }>
                <option value="all">All</option>
                <option value="bet">Between</option>
              </select> 
              After: <input type="date" value={aDate} onChange = { (e) => setADate(e.target.value) } /> 
              Before: <input type="date" value={bDate} onChange = { (e) => setBDate(e.target.value) } /> 
              <br/>
              Time (hh:mm:ss): 
              <select value={timeDir} onChange={ (e) => setTimeDir(e.target.value) }>
                <option value="all">All</option>
                <option value="gt">Longer than</option>
                <option value="lt">Shorter than</option>
              </select>
              <input type="number" style={{width: 50}} value={hTimeVal} onChange = { (e) => setHTimeVal(e.target.value) } /> 
              <input type="number" style={{width: 50}} value={mTimeVal} onChange = { (e) => setMTimeVal(e.target.value) } />  
              <input type="number" style={{width: 50}} value={timeVal} onChange = { (e) => setTimeVal(e.target.value) } /> <br />
              Distance: 
              <select value={disDir} onChange={ (e) => setDisDir(e.target.value) }>
                <option value="all">All</option>
                <option value="gt">Longer than</option>
                <option value="lt">Shorter than</option>
              </select> 
              <input type="number" value={disVal} onChange = { (e) => setDisVal(e.target.value) } placeholder="Distance"/>mi <br />
              Pace: 
              <select value={paceDir} onChange={ (e) => setPaceDir(e.target.value) }>
                <option value="all">All</option>
                <option value="gt">Slower than</option>
                <option value="lt">Faster than</option>
              </select> 
              <input type="number" value={mPaceVal} onChange = { (e) => setMPaceVal(e.target.value) } />
              <input type="number" value={paceVal} onChange = { (e) => setPaceVal(e.target.value) } /> /mi <br />
              Run Type: 
              <select value={runType} onChange={ (e) => setRunType(e.target.value) }>
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="tempo">Tempo</option>
                <option value="long">Long</option>
                <option value="race">Race</option>
              </select>
              
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
              </select> 

              <br/><br/><input type="submit" value= "Submit" />
            </form>
            <br/>
            { showRuns(displayRuns) } 
            
          </div>
        );
    
}


export default Profile;