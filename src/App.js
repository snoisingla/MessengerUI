import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LogIn from "./LogIn";
import Home from "./Home";
import Users from "./Users";
import FetchProfile from "./FetchProfile";
import ComposeMessage from "./ComposeMessage";
import Test from "./Test";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/login" component={LogIn} />
          <Route exact path="/" component={Home} />
          <Route exact path="/users" component={Users} />
          <Route path="/fetchProfile" component={FetchProfile} />
          <Route path="/composeMessage" component={ComposeMessage} />
          <Route path="/test" component={Test} />
        </div>
      </Router>
    );
  }
}

export default App;
