import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Database from './Database'
import Collection from './Collection'

function App() {

  // JSX

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/database' component={ Database } />
        <Route path='/collection' component={ Collection } />
        <Redirect from='/' to='/database' />
      </Switch>
    </BrowserRouter>
  )
}

export default App;
