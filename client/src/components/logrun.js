import React, { useRef, useState, useEffect } from 'react'

import { useAuth } from '../context/auth';

function LogRun (props) {
    const [apiResponse, setApiResponse] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [distance, setDistance] = useState("");
    const [runType, setRunType] = useState("easy");
   //const [elevation, setElevation] = useState("");
   //const [heartRate, setHeartRate] = useState("");
    const [runToSave, setRunToSave] = useState({ name: "", age: "" }); 
   
    const firstRenderSubmit = useRef(false);
   
    const auth = useAuth();
    
    const saveRun = (e)  => {
        e.preventDefault();
        setRunToSave({ date, time, distance, runType });
        setDate("");
        setTime("");
        setDistance("");
        setRunType(""); 
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
            Time: <input type="number" value={time} onChange = { (e) => setTime(e.target.value) } placeholder="Time"/> <br />
            Distance: <input type="number" value={distance} onChange = { (e) => setDistance(e.target.value) } placeholder="Distance"/> <br />
            <label>
              Run Type: 
              <select value={runType} onChange={ (e) => setRunType(e.target.value) }>
                <option value="easy">Easy</option>
                <option value="tempo">Tempo</option>
                <option value="long">Long</option>
                <option value="race">Race</option>
              </select>
            </label>

            <input type="submit" value="Save Run" />
          </form>

          { showResponse() }
        </div>
        );
      
    }
    


export default LogRun;