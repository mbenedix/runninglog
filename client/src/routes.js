import React from 'react'
import { Route, Switch } from 'react-router-dom'
import App from './App'
import Output from './components/output';
import Input from './components/input';

const Routes = () => (
    <App>
        <Switch>
            <Route exact path="/output" component={Output} />
            <Route exact path="/input" component={Input} />
        </Switch>
    </App> )

export default Routes