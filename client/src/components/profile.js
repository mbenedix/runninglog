import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import { convFromSecs, convToSecs, addPace, formatNumbers,filterRuns, toStrDate, sortRuns, createAggData, createRunData } from '../functions'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useStyles }  from '../theme';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

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

  //api call for run data
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
      return response.json()  
    })
    .then((data) => {
      setRuns(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }, [auth.JWT]);
 
  //one-time run data clean
  useEffect(() => {
    if (runs !== "" && resStatus === 200){
      let tempRuns = runs; 
      
      tempRuns = addPace(tempRuns);
      tempRuns = formatNumbers(tempRuns);
      
      setFullRuns(tempRuns);
    }    
  }, [auth.JWT, resStatus, runs]);
  
  //filters and sorts
  useEffect(() => {
    if (resStatus === 200) {
      let tempFullRuns = fullRuns;
      
      tempFullRuns = filterRuns(filterObj, tempFullRuns)
      tempFullRuns = sortRuns(sortObj, tempFullRuns);

      setDisplayRuns(tempFullRuns);
    }
  }, [sortObj, filterObj, fullRuns, resStatus]);

  //determines how runs should be displayed and displays them in charts
  const showRuns = (runs) => {
    if (runs === ''){
      return;
    }

    else if(runs.length === 0) {
      return <Typography variant="h5" color="primary" align="center" className={ classes.text2 }><strong>You have no runs to display.</strong></Typography>
    }
        
    else  {  
      if(resStatus === 200) {
        const totalTime = runs.reduce((acc, run) => {return acc + run.time}, 0);
        const formTotalTime = convFromSecs(totalTime);
        const totalDistance = runs.reduce((acc, run) => {return acc + run.distance}, 0);
        const avgPace = convFromSecs(Math.round(totalTime/totalDistance));
        const avgTime = convFromSecs(Math.round(totalTime/runs.length));
        const avgDistance = (totalDistance/runs.length).toFixed(2);

        const aggRunChart = [createAggData(formTotalTime, totalDistance, avgTime, avgDistance, avgPace)];

        const runChart = runs.map((run, i) =>  createRunData(run.date, run.formTime, run.distance, run.formPace, run.runType));
    
        return (
          <div className={ classes.chart }> 
            <Typography variant="h5" color="primary" align="center" className={ classes.text2 }><strong>Aggregate Statistics</strong></Typography>

            <TableContainer align="center" component={ Paper } variant="outlined">
              <Table className={ classes.table } aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center"><Typography variant="body1" color="primary" align ="center"><strong>Total Time</strong></Typography></TableCell>
                    <TableCell align="center"><Typography variant="body1" color="primary" align ="center"><strong>Total Distance</strong></Typography></TableCell>
                    <TableCell align="center"><Typography variant="body1" color="primary" align ="center"><strong>Average Time</strong></Typography></TableCell>
                    <TableCell align="center"><Typography variant="body1" color="primary" align ="center"><strong>Average Distance</strong></Typography></TableCell>
                    <TableCell align="center"><Typography variant="body1" color="primary" align ="center"><strong>Average Pace</strong></Typography></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  { aggRunChart.map((row, i) => (
                    <TableRow key={ i }>
                      <TableCell align="center">{ row.totalTime }</TableCell>
                      <TableCell align="center">{ row.totalDistance } mi</TableCell>
                      <TableCell align="center">{ row.avgTime }</TableCell>
                      <TableCell align="center">{ row.avgDistance } mi</TableCell>
                      <TableCell align="center">{ row.avgPace } /mi</TableCell>
                    </TableRow>
                  )) }
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="h5" color="primary" align ="center" className={ classes.text2 }><strong>Runs</strong></Typography>

            <TableContainer align="center" component={ Paper } variant="outlined">
              <Table className={ classes.table } aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center"><Typography variant="body1" color="primary" align ="center"><strong>Date</strong></Typography></TableCell>
                    <TableCell align="center"><Typography variant="body1" color="primary" align ="center"><strong>Time</strong></Typography></TableCell>
                    <TableCell align="center"><Typography variant="body1" color="primary" align ="center"><strong>Distance</strong></Typography></TableCell>
                    <TableCell align="center"><Typography variant="body1" color="primary" align ="center"><strong>Pace</strong></Typography></TableCell>
                    <TableCell align="center"><Typography variant="body1" color="primary" align ="center"><strong>Run Type</strong></Typography></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  { runChart.map((row, i) => (
                    <TableRow key={ i }>
                      <TableCell align="center">{ row.date }</TableCell>
                      <TableCell align="center">{ row.formTime }</TableCell>
                      <TableCell align="center">{ row.distance } mi</TableCell>
                      <TableCell align="center">{ row.formPace } /mi</TableCell>
                      <TableCell align="center">{ row.runType }</TableCell>
                    </TableRow>
                  )) }
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
      <Typography variant="h4" color="primary" align="center" className={ classes.text2 }><strong>Profile</strong></Typography>

      <Grid container alignItems="center" justify="center" direction="column">
        <Box border={ 1 } borderRadius={ 16 } className={ classes.box } width="50%" maxWidth={ 600 } >
          <form onSubmit={ saveForm }>
      
            <Typography variant="h5" color="primary" align="center" className={ classes.text2 }>Include Runs</Typography>
          
            <FormControl variant="outlined" required className={ classes.formControl } size='small'>
              <InputLabel id="date-dir">Date</InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={ dateDir }
                onChange={ (e) => setDateDir(e.target.value) }
                className={ classes.selectEmpty }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="bet">Between</MenuItem>
              </Select>
            </FormControl>
              
            <MuiPickersUtilsProvider utils={ DateFnsUtils }>
              <KeyboardDatePicker
                className={ classes.datePicker }
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="After"
                value={aDate}
                onChange={ (d) => setADate(d) }
                KeyboardButtonProps={{ 'aria-label': 'change date' }}
              />
            </MuiPickersUtilsProvider>         
              
            <MuiPickersUtilsProvider utils={ DateFnsUtils }>
              <KeyboardDatePicker
                className={ classes.datePicker }
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Before"
                value={bDate}
                onChange={ (d) => setBDate(d) }
                KeyboardButtonProps={{ 'aria-label': 'change date' }}
              />
            </MuiPickersUtilsProvider> <br/>

            <FormControl variant="outlined" required className={ classes.formControl } size='small'>
              <InputLabel id="time-dir">Time</InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={ timeDir }
                onChange={ (e) => setTimeDir(e.target.value) }
                className={ classes.selectEmpty }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="gt">Longer Than</MenuItem>
                <MenuItem value="lt">Shorter Than</MenuItem>
              </Select>
            </FormControl>      
              
            <TextField
              id="hours-box"
              required
              className={ classes.profleTextBox }
              label="Hours"
              type="number"
              size="small"
              value={ hTimeVal }
              onChange = { (e) => setHTimeVal(e.target.value) }
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: "1", min: "0", max: "100" }}
              variant="outlined"
            />     

            <TextField
              id="mins-box"
              required
              className={ classes.profleTextBox }
              label="Mins"
              type="number"
              size="small"
              value={ mTimeVal }
              onChange = { (e) => setMTimeVal(e.target.value) }
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: "1", min: "0", max: "59" }}
              variant="outlined"
            />      

            <TextField
              id="secs-box"
              required
              className={ classes.profleTextBox }
              label="Secs"
              type="number"
              size="small"
              value={ timeVal }
              onChange = { (e) => setTimeVal(e.target.value) }
              
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: "1", min: "0", max: "59" }}
              variant="outlined"
            /> <br/>
              
            <FormControl variant="outlined" required className={ classes.formControl } size='small'>
              <InputLabel id="dis-dir">Distance</InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={ disDir }
                onChange={ (e) => setDisDir(e.target.value) }
                className={ classes.selectEmpty }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="gt">Longer Than</MenuItem>
                <MenuItem value="lt">Shorter Than</MenuItem>
              </Select>
            </FormControl>

            <TextField
              id="dis-val"
              required
              className={ classes.profleTextBox }
              label="Miles"
              type="number"
              size="small"
              value={ disVal }
              onChange = { (e) => setDisVal(e.target.value) }
              
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: "0.01", min: "0", max: "100" }}
              variant="outlined"
            /> <br/>

            <FormControl variant="outlined" required className={ classes.formControl } size='small'>
              <InputLabel id="pace-dir">Pace</InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={ paceDir }
                onChange={ (e) => setPaceDir(e.target.value) }
                className={ classes.selectEmpty }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="gt">Slower Than</MenuItem>
                <MenuItem value="lt">Faster Than</MenuItem>
              </Select>
            </FormControl>      
              
            <TextField
              id="pace-mins-box"
              required
              className={ classes.profleTextBox } 
              label="Mins"
              type="number"
              size="small"
              value={ mPaceVal }
              onChange = { (e) => setMPaceVal(e.target.value) }
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: "1", min: "0", max: "59" }}
              variant="outlined"
            /> 

            <TextField
              id="pace-secs-box"
              required
              className={ classes.profleTextBox }
              label="Secs"
              type="number"
              size="small"
              value={ paceVal }
              onChange = { (e) => setPaceVal(e.target.value) }
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: "1", min: "0", max: "59" }}
              variant="outlined"
            /> <br/>

            <FormControl variant="outlined" required className={ classes.formControl } size='small'>
              <InputLabel id="run-type">Run Type</InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={ runType }
                onChange={ (e) => setRunType(e.target.value) }
                className={ classes.selectEmpty }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="tempo">Tempo</MenuItem>
                <MenuItem value="long">Long</MenuItem>
                <MenuItem value="race">Race</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="h5" color="primary" align="center" className={ classes.text2 }>Sort By</Typography>

            <FormControl variant="outlined" required className={ classes.formControl } size='small'>
              <InputLabel id="sort-val">Sort By</InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={ sortVal }
                onChange={ (e) => setSortVal(e.target.value) }
                className={ classes.selectEmpty }
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="time">Time</MenuItem>
                <MenuItem value="distance">Distance</MenuItem>
                <MenuItem value="pace">Pace</MenuItem>
              </Select>
            </FormControl> 

            <FormControl variant="outlined" required className={ classes.formControl } size='small'>
              <InputLabel id="sort-dir">Direction</InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={ sortDir }
                onChange={ (e) => setSortDir(e.target.value) }
                className={ classes.selectEmpty }
              >
                <MenuItem value="desc">Descending</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
              </Select>
            </FormControl> <br/>
                
            <div align="center">
              <FormControl className={ classes.formControl }>
                <Button variant="contained" color="primary" type="submit" size='small' >
                  Sort & Filter
                </Button>
              </FormControl> <br/>
            </div>
          </form>
        </Box> 

        { showRuns(displayRuns) } 
      </Grid>
    </div>
  );  
}

export default Profile;