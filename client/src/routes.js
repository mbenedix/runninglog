import React, { createContext, useContext, useState }from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import App from './App'
import Output from './components/output';
import Input from './components/input';
import Login from './components/login';
import Register from './components/register';
import NavBar from './components/navBar';

import { AuthContext } from './context/auth'
//import Protected from './components/'


const Routes = () => {

    const [JWT, setJWT] = useState(localStorage.getItem('jwt') || '');
   
    
    const setTokens = (data) => {
      localStorage.setItem("jwt", JSON.stringify(data));
      setJWT(data);
    }
   


return (
    <App>
        <AuthContext.Provider value={{ JWT: JWT, setJWT: setTokens  }}>
        <NavBar /> <br/>
            <Switch>
                <Route exact path="/output" component={Output} />
                <Route exact path="/input" component={Input} />   
                <Route exact path="/login" component={Login} /> 
                <Route exact path="/register" component={Register} />               
                <Route component={Output} /> {/*default route (could go to 404 page)*/}
            </Switch>
        </AuthContext.Provider>
    </App> 
    
  );
}
export default Routes
