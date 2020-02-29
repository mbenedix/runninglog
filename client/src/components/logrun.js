import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../context/auth';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useStyles } from '../theme'
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { getMonth, getYear, getDate } from 'date-fns';

function LogRun (props) {
  const [apiResponse, setApiResponse] = useState("");
  const [date, setDate] = useState(new Date());
  const [mTime, setMTime] = useState(0);
  const [hTime, setHTime] = useState(0);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [runType, setRunType] = useState("easy");
  const [runToSave, setRunToSave] = useState({ name: "", age: "" }); 
  
  const firstRenderSubmit = useRef(false);
  
  const auth = useAuth();
  
  const classes = useStyles();

  const saveRun = (e)  => {
    e.preventDefault();

    let totalTime = (hTime*3600) + (mTime*60) + (time*1);
    let strDate = getYear(date) + '-' + String(getMonth(date)+1).padStart(2,'0') +  '-' + String(getDate(date)).padStart(2,'0');
    
    setRunToSave({ date: strDate, time: totalTime, distance, runType });

    setDate(new Date());
    setHTime(0);
    setMTime(0);
    setTime(0);
    setDistance("");
    setRunType("easy"); 
  }
          
  useEffect(() => {
    if (firstRenderSubmit.current){
      let data = runToSave;

      fetch('http://localhost:9000/saverun', {
        method: 'POST',
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
    return (<Typography variant="body1" color="primary" className={ classes.text } align="center">{ apiResponse }</Typography> )  
  }
  
  return (
    <Grid container alignItems="center" justify="center" direction="column">
      <Box border={ 1 } borderRadius={ 16 } className={ classes.box } width="50%" maxWidth={ 350 } >
        <Typography variant="h4" color="primary" className={ classes.text } align="center"><strong>Log a Run</strong></Typography>
        <form onSubmit={ saveRun }>
          <MuiPickersUtilsProvider utils={ DateFnsUtils }>
            <KeyboardDatePicker
              required
              className={ classes.datePicker }
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date"
              value={ date }
              onChange={ (d) => setDate(d) }
              KeyboardButtonProps={{ 'aria-label': 'change date' }}
            />
          </MuiPickersUtilsProvider> <br/>

          <TextField
            id="hours-box"
            required
            className={ classes.narrowTextBox} 
            label="Hours"
            type="number"
            size="small"
            value={ hTime }
            onChange = { (e) => setHTime(e.target.value) }
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: "1", min: "0", max: "100" }}
            variant="outlined"
          />       

          <TextField
            id="mins-box"
            required
            className={ classes.narrowTextBox }
            label="Mins"
            type="number"
            size="small"
            value={ mTime }
            onChange = { (e) => setMTime(e.target.value) }
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: "1", min: "0", max: "59" }}
            variant="outlined"
          />           

          <TextField
            id="secs-box"
            required
            className={ classes.narrowTextBox }
            label="Secs"
            type="number"
            size="small"
            value={ time }
            onChange = { (e) => setTime(e.target.value) }
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: "1", min: "0", max: "59" }}
            variant="outlined"
          />   <br/>

          <TextField
            id="distance-box"
            required
            className={ classes.narrowTextBox }
            label="Distance"
            type="number"
            size="small"
            value={ distance }
            onChange = { (e) => setDistance(e.target.value) }
            helperText="miles"
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: "0.01", min: "0", max: "100" }}
            variant="outlined"
          />   <br/>

          <FormControl variant="outlined" required className={ classes.formControl } size='small'>
            <InputLabel id="run-type">Run Type</InputLabel>
            <Select
              labelId="demo-simple-select-required-label"
              id="demo-simple-select-required"
              value={ runType }
              onChange={ (e) => setRunType(e.target.value) }
              className={ classes.selectEmpty }
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="tempo">Tempo</MenuItem>
              <MenuItem value="long">Long</MenuItem>
              <MenuItem value="race">Race</MenuItem>
            </Select>
          </FormControl>
          <br/>

          <div align="center">
            <FormControl className={ classes.formControl } >
                <Button variant="contained" color="primary" type="submit" size='small' startIcon={ <SaveIcon /> }>
                Save Run
                </Button>
            </FormControl>
          </div>
        </form>      
      </Box>
      { showResponse() }
    </Grid>
  ); 
}
    
export default LogRun;