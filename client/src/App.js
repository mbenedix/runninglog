// app.js
import React from 'react';
import './App.css';



function App(props) {
  
  return (
   <div>
    {props.children}
   </div>   
        
  );
  
}

export default App;