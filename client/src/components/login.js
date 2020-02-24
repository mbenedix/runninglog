import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../context/auth';
import { Redirect } from 'react-router-dom'
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

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(1),
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
}));

function Login (props) {
    const [apiResponse, setApiResponse] = useState("");
    
    const [inputName, setInputName] = useState("");
    const [inputPass, setInputPass] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [userToSave, setuserToSave] = useState({ 
      username: "", 
      password: "",
    }); 
   
    const firstRenderSubmit = useRef(false);
    
    const auth = useAuth();

    const classes = useStyles();

    const saveUser = (event)  => {
        event.preventDefault();
        setuserToSave({ username: inputName, password: inputPass});

        setInputName("");
        setInputPass(""); 
    }

  
    
   
      useEffect(() => {
        if (firstRenderSubmit.current) {
          let data = userToSave;
          //console.log(data);
          fetch('http://localhost:9000/login', {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          .then((response) => response.text())
          .then((data) => {
            console.log('Success:', data);
            if(data === "1") {
              setApiResponse("Username not found. Please register.");
            }
            else if(data === "2") {
              setApiResponse("Incorrect password. Please try again.");
            }
            else {
              auth.setJWT(data);
              auth.setUser(userToSave.username);
              setLoggedIn(true);
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        }

        else {
          firstRenderSubmit.current = true;
        }
      /*adding auth as dependency causes bug which makes this effect fire twice
        since the effect updates auth by design*/
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [userToSave]);

     const showresult = () => {
       return (<h1>{apiResponse}</h1>)
     }

     const redirect = () => 
     {
       if(loggedIn) {
         return (<Redirect to='/profile' />)
       }
     }
      return (
        
        <div>
          <Typography variant="h4" color="primary" className={classes.text}>Login</Typography>
          <form onSubmit={saveUser}>
            {/*<input type="text" value={inputName} onChange = {handleNameChange} placeholder="Username" /> <br />
            <input type="password" value={inputPass} onChange = {handlePassChange} placeholder="Password" /> <br />*/}
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
              
              value={inputPass}
              onChange = { (e) => setInputPass(e.target.value) }
              
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{step: "1", min: "0", max: "59"}}
              variant="outlined"
            />   <br/>
            <FormControl className={classes.formControl}>
              <Button variant="contained" color="primary" type="submit" size='small' >
                Login
              </Button>
            </FormControl>

          { showresult() }
          { redirect() }
          </form>
        </div>
        );
      
    }

export default Login;