import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
//import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { getMonth, getYear, getDate } from 'date-fns';
const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(1),
  },

  textBox: {
    marginTop: theme.spacing(2),
    margin: theme.spacing(1),
    width: 100,
    
  },
  datePicker: {
    margin: theme.spacing(1),
    width: 150,
  },
  text: {
    margin: theme.spacing(2),
  },
  table: {
    minWidth: 100,
  },
}));

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



const toStrDate = (date) => getYear(date) + '-' + String(getMonth(date)+1).padStart(2,'0') +  '-' + String(getDate(date)).padStart(2,'0');

const tomorrow = new Date(); 
tomorrow.setDate(tomorrow.getDate()+1);

const begOfMonth = new Date();
begOfMonth.setDate(0);

function Profile (props) {
  //controlled forms
  const [sortVal, setSortVal] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [sortObj, setSortObj] = useState({val: "date", dir: "desc"});
  const [filterObj, setFilterObj] = useState({dateDir: "all", aDate: "", bDate: "", timeDir: "all", timeVal: "", disDir: "all", disVal: "", paceDir: "all", paceVal: "", runType: "all"});
  const [dateDir, setDateDir] = useState('all');
  const [aDate, setADate] = useState(begOfMonth);
  const [bDate, setBDate] = useState(tomorrow);
  const [timeDir, setTimeDir] = useState('all');
  const [timeVal, setTimeVal] = useState(0);
  const [mTimeVal, setMTimeVal] = useState(0);
  const [hTimeVal, setHTimeVal] = useState(0);
  const [disDir, setDisDir] = useState('all');
  const [disVal, setDisVal] = useState(0);
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

  const classes = useStyles();

  const saveForm = (e) => { 
    e.preventDefault();

    let timeSecs = convToSecs(hTimeVal, mTimeVal, timeVal);
    let paceSecs = convToSecs(0, mPaceVal, paceVal);

    let strADate = toStrDate(aDate);
    let strBDate = toStrDate(bDate);

    setSortObj({val: sortVal, dir: sortDir});
    setFilterObj({dateDir, aDate: strADate, bDate: strBDate, timeDir, timeVal: timeSecs, disDir, disVal, paceDir, paceVal: paceSecs, runType});
    
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
      return <Typography variant="h5" color="primary" align="center" className={classes.text}><strong>You have no runs to display.</strong></Typography>
    }
        
    else  {
            
      let totalTime, formTotalTime, totalDistance, avgPace, avgTime, avgDistance;

      const createAggData = (totalTime, totalDistance, avgTime, avgDistance, avgPace) => { 
        return { totalTime, totalDistance, avgTime, avgDistance, avgPace };
      };

      const createRunData = (date, formTime, distance, formPace, runType) => {
        return { date, formTime, distance, formPace, runType };
      }

      if(resStatus === 200) {
        totalTime = runs.reduce((acc, run) => {return acc + run.time}, 0);
        formTotalTime = convFromSecs(totalTime);
        totalDistance = runs.reduce((acc, run) => {return acc + run.distance}, 0);
        avgPace = convFromSecs(Math.round(totalTime/totalDistance));
        avgTime = convFromSecs(Math.round(totalTime/runs.length));
        avgDistance = (totalDistance/runs.length).toFixed(2);

        const aggRunChart = [createAggData(formTotalTime, totalDistance, avgTime, avgDistance, avgPace)];

        const runChart = runs.map((run, i) =>  createRunData(run.date, run.formTime, run.distance, run.formPace, run.runType));
    
            
        return (
            <div>
                    
              <Typography variant="h5" color="primary" align="center" className={classes.text}><strong>Aggregate Statistics</strong></Typography>

              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Total Time</TableCell>
                      <TableCell align="center">Total Distance</TableCell>
                      <TableCell align="center">Average Time</TableCell>
                      <TableCell align="center">Average Distance</TableCell>
                      <TableCell align="center">Average Pace</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {aggRunChart.map((row, i) => (
                      <TableRow key={i}>
                      
                        <TableCell align="center">{row.totalTime}</TableCell>
                        <TableCell align="center">{row.totalDistance} mi</TableCell>
                        <TableCell align="center">{row.avgTime}</TableCell>
                        <TableCell align="center">{row.avgDistance} mi</TableCell>
                        <TableCell align="center">{row.avgPace}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h5" color="primary" align ="center" className={classes.text}><strong>Runs</strong></Typography>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Date</TableCell>
                      <TableCell align="center">Time</TableCell>
                      <TableCell align="center">Distance</TableCell>
                      <TableCell align="center">Pace</TableCell>
                      <TableCell align="center">Run Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {runChart.map((row, i) => (
                      <TableRow key={i}>
                      
                        <TableCell align="center">{row.date}</TableCell>
                        <TableCell align="center">{row.formTime}</TableCell>
                        <TableCell align="center">{row.distance} mi</TableCell>
                        <TableCell align="center">{row.formPace}</TableCell>
                        <TableCell align="center">{row.runType}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
        );
      }
      else {
        return "";
      }
    }        
  }
    
  return (
    <div>
        
      <form onSubmit={saveForm}>
      <Typography variant="h4" color="primary" align="center" className={classes.text}><strong>Profile</strong></Typography>

      <Typography variant="h5" color="primary" className={classes.text}>Include Runs:</Typography>
      
      <FormControl variant="outlined" required className={classes.formControl} size='small'>
        <InputLabel id="date-dir">Date</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={dateDir}
          onChange={ (e) => setDateDir(e.target.value)}
          className={classes.selectEmpty}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="bet">Between</MenuItem>
        
        </Select>
        </FormControl>
        
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            
            className={classes.datePicker}
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="After"
            value={aDate}
            onChange={ (d) => setADate(d) }
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>         
        
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            
            className={classes.datePicker}
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Before"
            value={bDate}
            onChange={ (d) => setBDate(d) }
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider> <br/>

        <FormControl variant="outlined" required className={classes.formControl} size='small'>
        <InputLabel id="time-dir">Time</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={timeDir}
          onChange={ (e) => setTimeDir(e.target.value)}
          className={classes.selectEmpty}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="gt">Longer Than</MenuItem>
          <MenuItem value="lt">Shorter Than</MenuItem>
        
        </Select>
        </FormControl>      
        
        <TextField
          id="hours-box"
          required
          className={classes.textBox}
          label="Hours"
          type="number"
          size="small"
          
          value={hTimeVal}
          onChange = { (e) => setHTimeVal(e.target.value) }
        
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{step: "1", min: "0", max: "100"}}
          variant="outlined"
        />           
        <TextField
          id="mins-box"
          required
          className={classes.textBox}
          label="Mins"
          type="number"
          size="small"
          
          value={mTimeVal}
          onChange = { (e) => setMTimeVal(e.target.value) }
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{step: "1", min: "0", max: "59"}}
          variant="outlined"
        />           
        <TextField
          id="secs-box"
          required
          className={classes.textBox}
          label="Secs"
          type="number"
          size="small"
          
          value={timeVal}
          onChange = { (e) => setTimeVal(e.target.value) }
          
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{step: "1", min: "0", max: "59"}}
          variant="outlined"
        />   <br/>
        
        <FormControl variant="outlined" required className={classes.formControl} size='small'>
          <InputLabel id="dis-dir">Distance</InputLabel>
          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={disDir}
            onChange={ (e) => setDisDir(e.target.value)}
            className={classes.selectEmpty}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="gt">Longer Than</MenuItem>
            <MenuItem value="lt">Shorter Than</MenuItem>
          
          </Select>
        </FormControl>
        <TextField
          id="dis-val"
          required
          className={classes.textBox}
          label="Miles"
          type="number"
          size="small"
          
          value={disVal}
          onChange = { (e) => setDisVal(e.target.value) }
          
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{step: "0.01", min: "0", max: "100"}}
          variant="outlined"
        />  
      <br/>

        <FormControl variant="outlined" required className={classes.formControl} size='small'>
          <InputLabel id="pace-dir">Pace</InputLabel>
          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={paceDir}
            onChange={ (e) => setPaceDir(e.target.value)}
            className={classes.selectEmpty}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="gt">Slower Than</MenuItem>
            <MenuItem value="lt">Faster Than</MenuItem>
          
          </Select>
        </FormControl>      
        
        <TextField
        
        id="pace-mins-box"
        required
        className={classes.textBox}
        label="Mins"
        type="number"
        size="small"
        
        value={mPaceVal}
        onChange = { (e) => setMPaceVal(e.target.value) }
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{step: "1", min: "0", max: "59"}}
        variant="outlined"
      />           
        <TextField
        id="pace-secs-box"
        required
        className={classes.textBox}
        label="Secs"
        type="number"
        size="small"
        
        value={paceVal}
        onChange = { (e) => setPaceVal(e.target.value) }
        
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{step: "1", min: "0", max: "59"}}
        variant="outlined"
      /> <br/>

        <FormControl variant="outlined" required className={classes.formControl} size='small'>
          <InputLabel id="run-type">Run Type</InputLabel>
          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={runType}
            onChange={ (e) => setRunType(e.target.value)}
            className={classes.selectEmpty}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="tempo">Tempo</MenuItem>
            <MenuItem value="long">Long</MenuItem>
            <MenuItem value="race">Race</MenuItem>
          </Select>
      </FormControl>
      
      
        
        <Typography variant="h5" color="primary" className={classes.text}>Sort By:</Typography>

        <FormControl variant="outlined" required className={classes.formControl} size='small'>
        <InputLabel id="sort-val">Sort By</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={sortVal}
          onChange={ (e) => setSortVal(e.target.value)}
          className={classes.selectEmpty}
        >
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="time">Time</MenuItem>
          <MenuItem value="distance">Distance</MenuItem>
          <MenuItem value="pace">Pace</MenuItem>
        </Select>
        </FormControl> 

        <FormControl variant="outlined" required className={classes.formControl} size='small'>
        <InputLabel id="sort-dir">Direction</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={sortDir}
          onChange={ (e) => setSortDir(e.target.value)}
          className={classes.selectEmpty}
        >
          <MenuItem value="desc">Descending</MenuItem>
          <MenuItem value="asc">Ascending</MenuItem>
        
        </Select>
        </FormControl> <br/>

        <FormControl className={classes.formControl}>
          <Button variant="contained" color="primary" type="submit" size='small' >
            Sort & Filter
          </Button>
        </FormControl>
      </form>
      <br/>
      { showRuns(displayRuns) } 
      
    </div>
  );  
}


export default Profile;