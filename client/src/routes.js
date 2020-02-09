import React, { createContext, useContext }from 'react'
import { Route, Switch } from 'react-router-dom'
import App from './App'
import Output from './components/output';
import Input from './components/input';
import Login from './components/login';
import Register from './components/register';
import { AuthContext } from './context/auth'
//import Protected from './components/'


const Routes = () => {




return (
    <App>
        <AuthContext.Provider value={'eleven'}>
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
