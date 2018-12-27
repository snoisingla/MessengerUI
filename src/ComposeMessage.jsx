import React from "react";
import { Redirect } from "react-router-dom";

export default class ComposeMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pageState: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  handleSendMessage(event) {
    var url = "http://localhost:8080/messages";
    var data = {
      receiver: this.state.receiver,
      text: this.state.text
    };

    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
        authToken: localStorage.getItem("authToken")
      }
    }).then(response => {
      if (response.status !== 200) {
        this.setState({ pageState: "UnauthorisedRequests" });
      } else {
        this.setState({ pageState: "messageSent" });
      }
    });
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const pageState = this.state.pageState;
    console.log(pageState);
    if (pageState === "messageSent") {
      return <Redirect to="/" />;
    }
    return (
      <form>
        <label>
          Enter reveiver contact number
          <input type="tel" name="receiver" onChange={this.handleChange} />
        </label>
        <br />
        <label>
          Enter text
          <input type="text" name="text" onChange={this.handleChange} />
        </label>
        <input
          type="submit"
          value="Send Message"
          onClick={this.handleSendMessage}
        />
      </form>
    );
  }
}
