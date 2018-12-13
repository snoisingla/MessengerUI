import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LogIn from "./LogIn";
import Home from "./Home";
import Messages from "./Messages";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/login" component={LogIn} />
          <Route exact path="/" component={Home} />
          <Route exact path="/messages" component={Messages} />
        </div>
      </Router>
    );
  }
}

export default App;
