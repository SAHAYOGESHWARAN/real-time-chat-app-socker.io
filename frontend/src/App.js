import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import UserProfile from './components/UserProfile';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/chat" component={Chat} />
        <Route path="/profile" component={UserProfile} />
      </Switch>
    </Router>
  );
};

export default App;
