import React from "react";
export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = { page_num: 1, messages: [] };
  }

  componentDidMount() {
    this.handleMessage();
  }

  handleMessage() {
    var messages = this.state.messages;
    var page_num = this.state.page_num;
    var url =
      "http://localhost:8080/db-messages?page_num=" + page_num + "&page_size=3";
    fetch(url).then(response => {
      if (response.status !== 200) {
        this.setState({ pageType: "UnauthorisedRequests" });
      } else {
        response.json().then(json => {
          messages = messages.concat(json.content);
          console.log(messages);
          this.setState({ page_num: page_num + 1, messages: messages });
        });
      }
    });
  }

  render() {
    const page_num = this.state.page_num;
    if (page_num === null) {
      return <div />;
    }
    return <button onClick={() => this.handleMessage()}>Test</button>;
  }
}
