import React, { useRef, useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Box from '@material-ui/core/Box';
import { borders } from '@material-ui/system';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

  textBox: {
    margin: theme.spacing(1),
    width: 200,
    
  },
  datePicker: {
    margin: theme.spacing(1),
    width: 150,
  },
  text: {
    margin: theme.spacing(1),
  },
  box: {
    margin: theme.spacing(2),
  },
}));

function Register (props) {
    const [apiResponse, setApiResponse] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [inputName, setInputName] = useState("");
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("")
    const [userToSave, setuserToSave] = useState({ 
      username: "", 
      password: "",
      email: ""  
    }); 
   
    const firstRenderSubmit = useRef(false);

    const classes = useStyles();

   
    const saveUser = (event)  => {
        event.preventDefault();

        if(pass1 !== "" && pass1 === pass2) {
          setuserToSave({ username: inputName, password: pass1, email: inputEmail });
          setInputEmail("");
          setInputName("");
          setPass1(""); 
          setPass2(""); 
        }
        else {
          setApiResponse("Passwords don't match");
        }
    }

    const passwordsMatch = (pass1, pass2) => {
      if(pass1 !== "" && pass1 === pass2) {
        return (<CheckCircleIcon color="primary" className={classes.selectEmpty} />);
      }
      else {
        return "";
      }
    }

      const showResponse = () => {
        return (<Typography variant="body1" color="primary" className={classes.text}> {apiResponse} </Typography>);
      }

      useEffect(() => {
        if (firstRenderSubmit.current){
          let data = userToSave;
      console.log(data);
        fetch('http://localhost:9000/register', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then((response) => response.text())
        .then((data) => {
          setApiResponse(data);
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
        }
        else {
          firstRenderSubmit.current = true;
        }
      }, [userToSave]);
    

     
     
      return (
       
          <Grid container alignItems="center" justify="center"direction="column">
            <Box border={1} borderRadius={16} className={classes.box} width="50%" maxWidth={350} >
              <Typography variant="h4" color="primary" align="center" className={classes.text}><strong>Create Account</strong></Typography>
              <form onSubmit={saveUser} align="center">
                <TextField
                  id="email-box"
                  required
                  className={classes.textBox}
                  label="Email"
                  type="email"
                  size="small"
                  
                  value={inputEmail}
                  onChange = { (e) => setInputEmail(e.target.value) }
                  
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{step: "1", min: "0", max: "59"}}
                  variant="outlined"
                />   <br/>
                <TextField
                  id="username-box"
                  required
                  className={classes.textBox}
                  label="Username"
                  type="text"
                  size="small"
                  
                  value={inputName}
                  onChange = { (e) => setInputName(e.target.value) }
                  
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{step: "1", min: "0", max: "59"}}
                  variant="outlined"
                />   <br/>
                <TextField
                  id="password-box"
                  required
                  className={classes.textBox}
                  label="Password"
                  type="password"
                  size="small"
                  
                  value={pass1}
                  onChange = { (e) => setPass1(e.target.value) }
                  
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{step: "1", min: "0", max: "59"}}
                  variant="outlined"
                />   {passwordsMatch(pass1, pass2)}<br/>
                            <TextField
                  id="password-box-2"
                  required
                  className={classes.textBox}
                  label="Confirm Password"
                  type="password"
                  size="small"
                  
                  value={pass2}
                  onChange = { (e) => setPass2(e.target.value) }
                  
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{step: "1", min: "0", max: "59"}}
                  variant="outlined"
                />   {passwordsMatch(pass1, pass2)} <br/>
                <FormControl className={classes.formControl}>
                  <Button variant="contained" color="primary" type="submit" size='small' >
                    Create Account
                  </Button>
                </FormControl>
              </form>
              {showResponse()}
            </Box>
          </Grid>
      
        );    
    }
    


export default Register;