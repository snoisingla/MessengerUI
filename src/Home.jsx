import React from "react";
import { Redirect } from "react-router-dom";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usersContactNumber: "",
      pageState: "loggedIn",
      receiver: "",
      text: "",
      id: "",
      messages: [],
      userProfile: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAllMessages = this.handleAllMessages.bind(this);
    this.handleFetchProfile = this.handleFetchProfile.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleEditMessage = this.handleEditMessage.bind(this);
    this.handleDeleteMessage = this.handleDeleteMessage.bind(this);
    this.handleEditMessage = this.handleEditMessage.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleStateChange(state) {
    this.setState({ pageState: state });
  }

  handleAllMessages(event) {
    this.setState({ pageState: "messages" });
  }

  handleFetchProfile(event) {
    var contact = this.state.usersContactNumber;
    var url = "http://localhost:8080/users/";
    var finalUrl = url + contact;

    fetch(finalUrl, {
      headers: {
        authToken: localStorage.getItem("authToken")
      }
    }).then(response => {
      if (response.status !== 200) {
        this.setState({ pageState: "UnauthorisedRequests" });
      } else {
        response.json().then(json => console.log(json));
      }
    });
    event.preventDefault();
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
        response.json().then(json => console.log(json));
      }
    });
    event.preventDefault();
  }

  handleEditMessage(event) {
    var url = "http://localhost:8080/messages/";
    var id = this.state.id;
    var finalUrl = url + id;
    var data = {
      text: this.state.text
    };

    fetch(finalUrl, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
        authToken: localStorage.getItem("authToken")
      }
    }).then(response => {
      if (response.status !== 200) {
        this.setState({ pageState: "UnauthorisedRequests" });
      } else {
        response.json().then(json => console.log(json));
      }
    });
    event.preventDefault();
  }

  handleDeleteMessage(event) {
    var url = "http://localhost:8080/messages/";
    var id = this.state.id;
    var finalUrl = url + id;
    // var data = {
    //   id: this.state.id
    // };

    fetch(finalUrl, {
      method: "PUT",
      //body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
        authToken: localStorage.getItem("authToken")
      }
    }).then(response => {
      if (response.status !== 200) {
        this.setState({ pageState: "UnauthorisedRequests" });
      } else {
        response.json().then(json => console.log(json));
      }
    });
    event.preventDefault();
  }

  handleReceiveMessageById(event) {
    var id = this.state.id;
    var url = "http://localhost:8080/messages/";
    var finalUrl = url + id;

    fetch(finalUrl, {
      headers: {
        authToken: localStorage.getItem("authToken")
      }
    }).then(response => {
      if (response.status !== 200) {
        this.setState({ pageState: "UnauthorisedRequests" });
      } else {
        response.json().then(json => console.log(json));
      }
    });
    event.preventDefault();
  }

  render() {
    const pageState = this.state.pageState;
    console.log(pageState);
    if (pageState === "loggedIn") {
      return (
        <div>
          <h2>Home</h2>
          <ul>
            <li>
              <button onClick={() => this.handleStateChange("fetchProfile")}>
                Fetch User Profile
              </button>
            </li>
            <li>
              <button onClick={this.handleAllMessages}>All Messages</button>
            </li>
            <li>
              <button onClick={() => this.handleStateChange("sendMessage")}>
                Send Message
              </button>
            </li>
            <li>
              <button onClick={() => this.handleStateChange("receiveById")}>
                Receive Message By Id
              </button>
            </li>
            <li>
              <button onClick={() => this.handleStateChange("deleteMessage")}>
                Delete Message By Id
              </button>
            </li>
            <li>
              <button onClick={() => this.handleStateChange("editMessage")}>
                Edit Message
              </button>
            </li>
          </ul>
        </div>
      );
    } else if (pageState === "fetchProfile") {
      return (
        <form>
          <label>
            Enter user contact number :
            <input
              type="tel"
              name="usersContactNumber"
              onChange={this.handleChange}
            />
          </label>
          <input
            type="submit"
            value="Fetch"
            onClick={this.handleFetchProfile}
          />
        </form>
      );
    } else if (pageState === "editMessage") {
      return (
        <form>
          <label>
            Enter message ID
            <input type="number" name="id" onChange={this.handleChange} />
          </label>
          <br />
          <label>
            Enter text
            <input type="text" name="text" onChange={this.handleChange} />
          </label>
          <input type="submit" value="Edit" onClick={this.handleEditMessage} />
        </form>
      );
    } else if (pageState === "deleteMessage") {
      return (
        <form>
          <label>
            Enter message ID
            <input type="number" name="id" onChange={this.handleChange} />
          </label>
          <br />
          <input
            type="submit"
            value="Delete"
            onClick={this.handleDeleteMessage}
          />
        </form>
      );
    } else if (pageState === "receiveById") {
      return (
        <form>
          <label>
            Enter message ID
            <input type="number" name="id" onChange={this.handleChange} />
          </label>
          <br />
          <input
            type="submit"
            value="Receive Message"
            onClick={this.handleReceiveMessageById}
          />
        </form>
      );
    } else if (pageState === "sendMessage") {
      return (
        <form>
          <label>
            Enter reveiver contact number :
            <input type="tel" name="receiver" onChange={this.handleChange} />
          </label>
          <br />
          <label>
            Enter text :
            <input type="text" name="text" onChange={this.handleChange} />
          </label>
          <input
            type="submit"
            value="Send Message"
            onClick={this.handleSendMessage}
          />
        </form>
      );
    } else if (pageState === "UnauthorisedRequests") {
      return <Redirect to="/login" />;
    } else if (pageState === "messages") {
      return <Redirect to="/messages" />;
    }
  }
}
