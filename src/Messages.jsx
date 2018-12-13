import React from "react";
export default class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pageState: "", messages: [] };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  componentDidMount() {
    fetch("http://localhost:8080/messages", {
      headers: {
        authToken: localStorage.getItem("authToken")
      }
    }).then(response => {
      if (response.status !== 200) {
        this.setState({ pageState: "UnauthorisedRequests" });
      } else {
        response.json().then(json => {
          this.setState({ messages: json });
          // console.log(this.state.messages);
          this.setState({ pageState: "allMessages" });
        });
      }
    });
    // event.preventDefault();
  }

  render() {
    const pageState = this.state.pageState;
    const messages = Object.keys(this.state.messages).map(key => {
      return (
        <div>
          <ul>
            <li>Text : {this.state.messages[key].text}</li>
            <li>
              Sender Details
              <ul>
                <li>
                  Sender Contact Number :{" "}
                  {this.state.messages[key].sender.contactNumber}
                </li>
                <li>Sender Name : {this.state.messages[key].sender.name}</li>
                <li>
                  Sender Image Url :{" "}
                  {this.state.messages[key].sender.imageDownloadUrl}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      );
    });
    if (pageState === "allMessages") {
      return (
        <form>
          <p>All Messages</p>
          <label>{messages}</label>
          <br />
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
          <br />
          <label>
            Enter message ID
            <input type="number" name="id" onChange={this.handleChange} />
          </label>
          <input
            type="submit"
            value="Delete Message"
            onClick={this.handleDeleteMessage}
          />
          <br />
          <label>
            Enter message ID
            <input type="number" name="id" onChange={this.handleChange} />
          </label>
          <input
            type="submit"
            value="Edit Message"
            onClick={this.handleEditMessage}
          />
          <br />
          <label>
            Enter message ID
            <input type="number" name="id" onChange={this.handleChange} />
          </label>
          <input
            type="submit"
            value="Receive Message"
            onClick={this.handleEditMessage}
          />
          <br />
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
            value="Fetch User Profile"
            onClick={this.handleFetchProfile}
          />
        </form>
      );
    } else {
      return <label>Hi</label>;
    }
    //return <label>Hi</label>;
  }
}
