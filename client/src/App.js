import React, { useState }from 'react'
import { Route, Switch } from 'react-router-dom'

import Output from './components/output';
import Login from './components/login';
import Register from './components/register';
import LogRun from './components/logrun';
import NavBar from './components/navBar';
import NotFound from './components/notfound';

import PrivateRoute from './PrivateRoute';
import './App.css';
import { AuthContext } from './context/auth'



const App = () => {

    const [JWT, setJWT] = useState(localStorage.getItem('jwt') || '');
    const [user, setUser] = useState(localStorage.getItem('user') || '');
   
    
    const setTokens = (data) => {
      localStorage.setItem("jwt", data);
      setJWT(data);
    }
    
    const localSetUser = (data) => { 
      localStorage.setItem("user", data);
      setUser(data);
    }


return (
    
    <AuthContext.Provider value={{ JWT: JWT, setJWT: setTokens, user: user, setUser: localSetUser }}>
        <NavBar /> <br/>
            <Switch>
                <Route exact path="/output" component={Output} />
                <PrivateRoute exact path="/logrun" component={LogRun} />      
                <Route exact path="/login" component={Login} /> 
                <Route exact path="/register" component={Register} />               
                <Route component={NotFound} /> {/*default route (could go to 404 page)*/}
            </Switch>
    </AuthContext.Provider>
    
    
  );
}
export default App
