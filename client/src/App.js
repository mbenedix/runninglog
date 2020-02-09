// app.js
import React from 'react';
import './App.css';
import NavBar from './components/navBar';



function App(props) {
  
    return (
        <div >
            <NavBar /> <br/>
            <div>
              {props.children}
            </div>   
        </div>
    );
  
  }

export default App;