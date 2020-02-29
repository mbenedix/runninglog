import React from 'react';
import { useAuth } from '../context/auth';
import { useStyles } from '../theme';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

function NavBar(){
  const classes = useStyles();

  const auth = useAuth();

  const logOut = () => {
    auth.setJWT("");
    auth.setUser("");
    localStorage.clear();
    handleClose();
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showLogin = (user) => {
    if(auth.user === "") {
      return (<Button component={ Link } to='/login' color="inherit" >Login</Button>)
    }

    else {
      return ( 
      <Typography variant="h6" align="right" className={ classes.title }>
        Welcome, { auth.user }
      </Typography>
     )
    }
  }

  return (
    <div className={ classes.root }>
      <AppBar color="primary" position="static">
        <Toolbar>
          <IconButton edge="start" onClick={ handleClick } className={ classes.menuButton } color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={ anchorEl }
            keepMounted
            open={ Boolean(anchorEl) }
            onClose={ handleClose }
          >
            <MenuItem component={ Link } to='/profile' onClick={ handleClose }>Profile</MenuItem>
            <MenuItem component={ Link } to='/logrun'onClick={ handleClose }>Log Run</MenuItem>
            <MenuItem component={ Link } to='/register' onClick={ handleClose }>Create Account</MenuItem>
            <MenuItem component={ Link } to='/login' onClick={ handleClose }>Login</MenuItem>
            <MenuItem component={ Link } to='/login' onClick={ logOut }>Logout</MenuItem>
          </Menu>

          <Typography variant="h6" className={ classes.title }>
            Running Log 
          </Typography>

          { showLogin(auth.user) }
        </Toolbar>
      </AppBar>  
    </div>
  );
}

export default NavBar