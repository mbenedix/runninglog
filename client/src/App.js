import React, { useState }from 'react'
import { Route, Switch } from 'react-router-dom'
//import App from './App'
import Output from './components/output';
import Input from './components/input';
import Login from './components/login';
import Register from './components/register';
import NavBar from './components/navBar';
import PrivateRoute from './PrivateRoute';
import './App.css';
import { AuthContext } from './context/auth'
//import Protected from './components/'


const App = () => {

    const [JWT, setJWT] = useState(localStorage.getItem('jwt') || '');
   
    
    const setTokens = (data) => {
      localStorage.setItem("jwt", data);
      setJWT(data);
    }
   


return (
    
    <AuthContext.Provider value={{ JWT: JWT, setJWT: setTokens  }}>
        <NavBar /> <br/>
            <Switch>
                <Route exact path="/output" component={Output} />
                <PrivateRoute exact path="/input" component={Input} />   
                <Route exact path="/login" component={Login} /> 
                <Route exact path="/register" component={Register} />               
                <Route component={Output} /> {/*default route (could go to 404 page)*/}
            </Switch>
    </AuthContext.Provider>
    
    
  );
}
export default App
