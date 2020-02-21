import React, { useRef, useState, useEffect } from 'react'

import { useAuth } from '../context/auth';

function LogRun (props) {
    const [apiResponse, setApiResponse] = useState("");
    const [date, setDate] = useState("");
    const [mTime, setMTime] = useState(0);
    const [hTime, setHTime] = useState(0);
    const [time, setTime] = useState(0);
    const [distance, setDistance] = useState("");
    const [runType, setRunType] = useState("easy");
   //const [elevation, setElevation] = useState("");
   //const [heartRate, setHeartRate] = useState("");
    const [runToSave, setRunToSave] = useState({ name: "", age: "" }); 
   
    const firstRenderSubmit = useRef(false);
   
    const auth = useAuth();
    
    const saveRun = (e)  => {
        e.preventDefault();

        let totalTime = (hTime*3600) + (mTime*60) + (time*1);
        console.log(typeof totalTime);
        setRunToSave({ date, time: totalTime, distance, runType });
        setDate("");
        setHTime(0);
        setMTime(0);
        setTime(0);
        setDistance("");
        setRunType("easy"); 
      }

      useEffect(() => {
        if (firstRenderSubmit.current){
          let data = runToSave;
          console.log(data);
          fetch('http://localhost:9000/saverun', {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
              'authorization': 'Bearer ' + auth.JWT
            },
            body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => {
              setApiResponse(data.message);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
        else {
          firstRenderSubmit.current = true;
        }
      }, [runToSave, auth.JWT]);
    
    
      

      const showResponse = () => { 
        if(apiResponse) {
          return (<h1> {apiResponse} </h1>)
        }
        
        return "";
      }
     
     
      return (
        <div>
          <form onSubmit={saveRun}>
            Date: <input type="date" value={date} onChange = { (e) => setDate(e.target.value) } /> <br />
            Time (hh:mm:ss): 
            <input type="number" value={hTime} onChange = { (e) => setHTime(e.target.value) } />:
            <input type="number" value={mTime} onChange = { (e) => setMTime(e.target.value) } />:
            <input type="number" value={time} onChange = { (e) => setTime(e.target.value) } /> <br />
            Distance: <input type="number" value={distance} onChange = { (e) => setDistance(e.target.value) } placeholder="Distance"/> Miles<br />
            <label>
              Run Type: 
              <select value={runType} onChange={ (e) => setRunType(e.target.value) }>
                <option value="easy">Easy</option>
                <option value="tempo">Tempo</option>
                <option value="long">Long</option>
                <option value="race">Race</option>
              </select>
            </label><br/>

            <input type="submit" value="Save Run" />
          </form>

          { showResponse() }
        </div>
        );
      
    }
    


export default LogRun;