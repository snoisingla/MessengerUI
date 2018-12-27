import React from "react";
import { Redirect, Link } from "react-router-dom";
import Sender from "./Sender";
import SenderWithMessages from "./SenderWithMessages";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageType: "home",
      senderContactNumber: null,
      messageMap: {},
      profile: null
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  fetchMessages() {
    fetch("http://localhost:8080/messages", {
      headers: {
        authToken: localStorage.getItem("authToken")
      }
    }).then(response => {
      if (response.status !== 200) {
        this.setState({ pageType: "UnauthorisedRequests" });
      } else {
        response.json().then(json => {
          let messageMap = this.convertMessagesToMap(json);
          this.setState({ messageMap: messageMap });
        });
      }
    });
  }

  componentDidMount() {
    this.fetchMessages();
  }

  convertMessagesToMap(messages) {
    let messageMap = {};
    let userContact = localStorage.getItem("contactNumber");
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      let friendJson =
        message.sender.contactNumber === userContact
          ? message.receiver
          : message.sender;

      let friend = Sender.createSenderFromJson(friendJson);

      if (messageMap.hasOwnProperty(friend.contactNumber)) {
        let friendWithMessage = messageMap[friend.contactNumber];
        friendWithMessage.messages.push(message);
      } else {
        let messageArray = [message];
        messageMap[friend.contactNumber] = new SenderWithMessages(
          friend,
          messageArray
        );
      }
    }
    return messageMap;
  }

  renderAllSenders() {
    const messageMap = this.state.messageMap;
    if (Object.keys(messageMap).length === 0) {
      return <div>You have no new messages!</div>;
    }
    var contactWithMessagesRows = [];
    for (var key in messageMap) {
      var val = messageMap[key];
      const ui = this.renderSender(val.sender);
      contactWithMessagesRows.push(ui);
    }
    return contactWithMessagesRows;
  }

  renderSender(sender) {
    const contact = sender.contactNumber;
    const senderProfileUrl = "fetchProfile/" + contact;

    const boxStyle = { height: 36 };
    return (
      <div>
        <img
          alt="Profile"
          src={sender.imageDownloadUrl}
          style={{ width: 30, height: 30 }}
        />
        <div
          style={boxStyle}
          onClick={() => {
            this.userClickedOnSender(contact);
          }}
        >
          <Link to={senderProfileUrl}>{sender.name}</Link>:{" "}
          {sender.contactNumber}
        </div>
      </div>
    );
  }

  userClickedOnSender(contact) {
    this.setState({ senderContactNumber: contact });
  }

  renderMessages() {
    const senderContactNumber = this.state.senderContactNumber;
    const messageMap = this.state.messageMap;

    if (!messageMap.hasOwnProperty(senderContactNumber)) {
      return;
    }
    const userContact = localStorage.getItem("contactNumber");
    const msgs = messageMap[senderContactNumber].messages;
    let messagesUI = [];
    for (let i = 0; i < msgs.length; i++) {
      var senderName =
        msgs[i].sender.contactNumber === userContact
          ? "You"
          : msgs[i].sender.name;
      messagesUI.push(
        <li>
          {senderName} : {msgs[i].text}
        </li>
      );
    }
    return <div>{messagesUI}</div>;
  }

  sendMessage(senderContactNumber, event) {
    var url = "http://localhost:8080/messages";
    var data = {
      receiver: senderContactNumber,
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
        this.setState({ pageType: "UnauthorisedRequests" });
      } else {
        this.setState({ text: "" });
        //to clear the message value in placeholder after user sends message
        this.fetchMessages();
      }
    });
    event.preventDefault();
  }

  renderSendMessageForm() {
    const senderContactNumber = this.state.senderContactNumber;
    if (senderContactNumber === null) {
      return;
    }
    return (
      <div>
        <input
          type="text"
          name="text"
          value={this.state.text}
          placeholder="Type a message"
          onChange={this.handleChange}
        />
        <button onClick={event => this.sendMessage(senderContactNumber, event)}>
          Send Message
        </button>
      </div>
    );
  }

  render() {
    const pageType = this.state.pageType;
    if (pageType === "UnauthorisedRequests") {
      return <Redirect to="/login" />;
    }
    const myProfileUrl =
      "fetchProfile/" + localStorage.getItem("contactNumber");

    return (
      <div>
        <Link to={myProfileUrl}>My Profile</Link>
        <br />
        <Link to="/composeMessage">Compose Message</Link>
        <br />
        <p>All Messages</p>
        {this.renderAllSenders()}
        {this.renderMessages()}
        <br />
        {this.renderSendMessageForm()}
      </div>
    );
  }
}
