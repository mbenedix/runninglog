import React from 'react'
import { Route, Switch } from 'react-router-dom'
import App from './App'
import Output from './components/output';
import Input from './components/input';
import Login from './components/login';
//import Protected from './components/'
import { AuthContext } from './context/auth';
import PrivateRoute from './privateroute';

const Routes = () => (
    <App>
        <AuthContext.Provider value={false}>
            <Switch>
                <Route exact path="/output" component={Output} />
                <PrivateRoute exact path="/input" component={Input} />
                <Route exact path="/login" component={Login} />
                
                <Route component={Output} /> {/*default route (could go to 404 page)*/}
            </Switch>
        </AuthContext.Provider>
    </App> )

export default Routes