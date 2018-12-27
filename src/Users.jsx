import React from "react";
import { Redirect } from "react-router-dom";

export default class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pageState: "" };
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  handleStateChange(state) {
    this.setState({ pageState: state });
  }

  render() {
    const pageState = this.state.pageState;
    if (pageState === "fetchProfile") {
      return <Redirect to="/users/fetchProfile" />;
    }
    return (
      <div>
        <button onClick={() => this.handleStateChange("fetchProfile")}>
          Fetch User Profile
        </button>
      </div>
    );
  }
}
