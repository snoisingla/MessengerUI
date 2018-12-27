import React from "react";
import { Redirect } from "react-router-dom";
export default class FetchProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageState: "fetchProfile",
      profile: null
    };
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  handleFetchProfile(response) {
    if (response.status !== 200) {
      this.setState({ pageState: "UnauthorisedRequests" });
    } else {
      response.json().then(json => {
        this.setState({ profile: json });
        const profile = this.state.profile;
        console.log(profile);
        localStorage.setItem("imageLink", profile.imageDownloadUrl);
      });
    }
  }

  fetchProfile() {
    const pageUrl = window.location.href;
    var contact = this.findContactFromUrl(pageUrl);
    var url = "http://localhost:8080/users/";
    var finalUrl = url + contact;

    fetch(finalUrl, {
      headers: {
        authToken: localStorage.getItem("authToken")
      }
    }).then(this.handleFetchProfile.bind(this));
  }

  componentDidMount() {
    this.fetchProfile();
  }

  handleFileUpload(event) {
    const url = "http://localhost:8080/users/uploadImage";
    var data = new FormData();
    const file = event.target.files;
    if (file.length === 0) {
      console.log("User input file not given");
      return;
    }
    data.append("file", file[0]);
    fetch(url, {
      method: "POST",
      body: data,
      headers: {
        authToken: localStorage.getItem("authToken")
      }
    }).then(response => {
      if (response.status !== 200) {
        this.setState({ pageState: "UnauthorisedRequests" });
      } else {
        response.json().then(json => {
          this.fetchProfile();
        });
      }
    });
  }

  findContactFromUrl(pageUrl) {
    const ar = pageUrl.split("/");
    return ar[ar.length - 1];
  }

  handleProfileUi(profile) {
    return (
      <div>
        <b>{profile.name}</b> : {profile.contactNumber}
      </div>
    );
  }

  render() {
    const pageState = this.state.pageState;
    const profile = this.state.profile;

    if (pageState === "UnauthorisedRequests") {
      return <Redirect to="/login" />;
    }

    if (profile === null) {
      return (
        <div>
          <label>Unable to fetch profile</label>
        </div>
      );
    }

    const link = profile.imageDownloadUrl;
    const contact = profile.contactNumber;

    return (
      <div>
        <p>User Profile</p>
        <img
          alt="User Profile"
          src={link}
          style={{ width: 100, height: 100 }}
        />
        <br />
        {contact === localStorage.getItem("contactNumber") && (
          <input
            type="file"
            name="profilePicture"
            onChange={this.handleFileUpload}
          />
        )}
        <br />

        {/* <a href={link} download>
          Save Image
        </a> */}
        <br />
        {this.handleProfileUi(profile)}
      </div>
    );
  }
}
