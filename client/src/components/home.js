import React from 'react';
import { useStyles } from '../theme';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

function Home () {
  const classes = useStyles();

  return (
    <Grid container alignItems="center" justify="center" direction="column">
      <Box className={ classes.box } width="80%">
        <Typography variant="h4" color="primary" align="center" className={ classes.text }><strong>Running Log</strong></Typography>

        <Typography variant="body1"  className={ classes.text }  align="left"> 
          <br/>
          This is a running log app built to learn basic MERN stack web development. 
          <br/>
          <br/>
          It allows you to create an account, login with that account, log runs, and view data from those runs. 
          Because the intent of the project was to learn basic web dev, nothing particularly novel is done with the data. 
          It does allow you to filter and sort the data which can provide insights of value when used with the simple
          aggregate statistics provided. 
          <br/>
          <br/>
          The frontend is built with React with hooks. The backend API server is built with Node and Express. 
          Data storage is accomplished with MongoDB and Mongoose. Authentication is done with JSON Web Tokens.
          It is intended to be deployed using Docker.   
        </Typography>
      </Box>
    </Grid>
  )
}

export default Home