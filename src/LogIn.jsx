import React from "react";
import { Redirect } from "react-router-dom";

export default class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      contactNumber: "",
      errorLabel: "",
      pageType: "signIn",
      otp: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleVerifyOtp = this.handleVerifyOtp.bind(this);
    this.handleResendOtp = this.handleResendOtp.bind(this);
    this.userClickedOnSignUp = this.userClickedOnSignUp.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSignUp(event) {
    var url = "http://localhost:8080/users";
    var data = {
      name: this.state.name,
      contactNumber: this.state.contactNumber,
      verified: false
    };

    fetch(url, {
      method: "POST",
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      if (response.status === 200) {
        this.setState({ pageType: "verifyOtp" });
      } else {
        this.setState({ errorLabel: "User already exists." });
      }
    });
    event.preventDefault();
  }

  handleSignIn(event) {
    var url = "http://localhost:8080/userExist/";
    var contact = this.state.contactNumber;
    var finalUrl = url + contact;

    fetch(finalUrl)
      .then(response => response.json())
      .then(response => {
        if (response === false) {
          this.setState({ errorLabel: "User doesnot exists. Please Sign Up." });
        } else {
          this.setState({ pageType: "verifyOtp" });
          this.handleResendOtp(event);
        }
      });
    event.preventDefault();
  }

  handleVerifyOtp(event) {
    var url = "http://localhost:8080/users/verify";
    var data = { contactNumber: this.state.contactNumber, otp: this.state.otp };
    localStorage.setItem("contactNumber", this.state.contactNumber);

    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => {
        if (response.verified === true) {
          localStorage.setItem("authToken", response.authToken);
          this.setState({ pageType: "userVerified" });
        } else {
          this.setState({
            errorLabel: "Invalid Otp entered. Please try again"
          });
        }
      });
    event.preventDefault();
  }

  handleResendOtp(event) {
    var url = "http://localhost:8080/otps/request"; //check if we can use getOTP
    var data = { contactNumber: this.state.contactNumber };
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      if (response.status === 200) {
        this.setState({ errorLabel: "Otp has been sent successfully" });
      } else {
        this.setState({ errorLabel: "Otp sending failed " });
      }
    });
    event.preventDefault();
  }

  userClickedOnSignUp() {
    this.setState({ errorLabel: "" });
    this.setState({ pageType: "signUp" });
  }

  render() {
    const pageType = this.state.pageType;
    const contact = this.state.contactNumber;
    const errorLabel = this.state.errorLabel;

    if (pageType === "signIn") {
      return (
        <div>
          <label> Contact Number </label>
          <input
            type="tel"
            placeholder="Enter Contact Number"
            name="contactNumber"
            onChange={this.handleChange}
          />
          <br />
          <button onClick={this.handleSignIn}>Sign In</button>
          <button onClick={this.userClickedOnSignUp}>New User</button>
          {errorLabel}
        </div>
      );
    } else if (pageType === "signUp") {
      return (
        <div>
          <label>
            Enter your name
            <input type="text" name="name" onChange={this.handleChange} />
          </label>
          <br />
          <label>
            Enter your mobile number
            <input
              type="tel"
              name="contactNumber"
              onChange={this.handleChange}
            />
          </label>

          <br />
          <button onClick={this.handleSignUp}>Sign Up</button>
          {errorLabel}
        </div>
      );
    } else if (pageType === "verifyOtp") {
      return (
        <div>
          <label>Otp has sent to {contact} </label>
          <br />
          <label>Enter Otp</label>
          <input type="number" name="otp" onChange={this.handleChange} />
          <br />
          <button onClick={this.handleVerifyOtp}>Verify Otp</button>
          {errorLabel}
          <br />
          <button onClick={this.handleResendOtp}>Resend Otp</button>
        </div>
      );
    } else if (pageType === "userVerified") {
      return <Redirect to="/" />;
    }
  }
}
