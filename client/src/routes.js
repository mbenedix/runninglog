import React from 'react'
import { Route, Switch } from 'react-router-dom'
import App from './App'
import Output from './components/output';
import Input from './components/input';
//import Login from './components/login';
//import Protected from './components/'

const Routes = () => (
    <App>
            <Switch>
                <Route exact path="/output" component={Output} />
                <Route exact path="/input" component={Input} />                
                <Route component={Output} /> {/*default route (could go to 404 page)*/}
            </Switch>
    </App> )

export default Routes