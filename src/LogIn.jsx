import React from "react";
import { Redirect } from "react-router-dom";

export default class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      contactNumber: "",
      status: "",
      pageState: "signIn"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleVerifyOtp = this.handleVerifyOtp.bind(this);
    this.handleResendOtp = this.handleResendOtp.bind(this);
    this.handlePageState = this.handlePageState.bind(this);
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
        this.setState({ pageState: "verifyOtp" });
      } else {
        this.setState({ pageState: "userAlreadyExists" });
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
          this.setState({ pageState: "userNotExists" });
        } else {
          this.handleResendOtp(event);
        }
      });
    event.preventDefault();
  }

  handleVerifyOtp(event) {
    var url = "http://localhost:8080/users/verify";
    var data = { contactNumber: this.state.contactNumber, otp: this.state.otp };

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
          this.setState({ pageState: "userVerified" });
          localStorage.setItem("authToken", response.authToken);
        } else {
          this.setState({ pageState: "otpVerficationFailed" });
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
        this.setState({ pageState: "otpResendSuccessfull" });
      } else {
        this.setState({ pageState: "otpResendFailed" });
      }
    });
    event.preventDefault();
  }

  handlePageState(event) {
    this.setState({ pageState: "signUp" });
    event.preventDefault();
  }

  getErrorLabel() {
    const pageState = this.state.pageState;
    if (pageState === "userAlreadyExists") {
      return <label>User already exists.</label>;
    } else if (pageState === "userNotExists") {
      return <label>User doesnot exists. Please Sign Up.</label>;
    } else if (pageState === "otpVerficationFailed") {
      return <label> Invalid Otp entered. Please try again </label>;
    } else if (pageState === "otpResendSuccessfull") {
      return <label> Otp has been sent successfully </label>;
    } else if (pageState === "otpResendFailed") {
      //ommit
      return <label> Otp sending failed </label>;
    }
  }

  render() {
    const pageState = this.state.pageState;
    const contact = this.state.contactNumber;

    console.log(pageState);

    if (pageState === "signIn" || pageState === "userNotExists") {
      return (
        <form>
          <label> Contact Number </label>
          <input
            type="tel"
            placeholder="Enter Contact Number"
            name="contactNumber"
            onChange={this.handleChange}
          />
          <br />
          <input type="submit" value="Sign In" onClick={this.handleSignIn} />
          <input
            type="submit"
            value="New User"
            onClick={this.handlePageState}
          />
          {this.getErrorLabel()}
        </form>
      );
    }

    if (pageState === "signUp" || pageState === "userAlreadyExists") {
      return (
        <form>
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
          <input type="submit" value="Sign Up" onClick={this.handleSignUp} />
          {this.getErrorLabel()}
        </form>
      );
    } else if (
      pageState === "verifyOtp" ||
      pageState === "otpVerficationFailed" ||
      pageState === "otpResendSuccessfull" ||
      pageState === "otpResendFailed"
    ) {
      return (
        <form>
          <label>Otp has sent to {contact} </label>
          <br />
          <label>Enter Otp</label>
          <input type="number" name="otp" onChange={this.handleChange} />

          <br />
          <input
            type="submit"
            value="Verify otp"
            onClick={this.handleVerifyOtp}
          />

          {this.getErrorLabel()}
          <br />
          <input
            type="submit"
            value="Resend Otp"
            onClick={this.handleResendOtp}
          />
        </form>
      );
    } else if (pageState === "userVerified") {
      return <Redirect to="/" />;
    }
  }
}
