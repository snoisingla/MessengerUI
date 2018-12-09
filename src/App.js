import React from 'react';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {name: '', contactNumber: '', status: '', pageState: 'signUp'};

        this.handleChange = this.handleChange.bind(this);
        this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this);
        this.handleVerifyOtp = this.handleVerifyOtp.bind(this);
        this.handleResendOtp = this.handleResendOtp.bind(this);
    }

    handleChange(event) {
         this.setState({[event.target.name]: event.target.value});
    }

    handleSignUpSubmit(event){
        var name = this.state.name;
        var contact = this.state.contactNumber;
        var url = 'http://localhost:8080/users';
        var data = {name : name, contactNumber: contact, verified: false};

        fetch(url, {
          method: 'POST', 
          body: JSON.stringify(data), // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json'
          }
        }).then(response => {
            if(response.status === 200){
                this.setState({pageState: 'verifyOtp'})
            }
            else{
                this.setState({pageState: 'signUpfailed'});
            }
        })
        event.preventDefault();
    }

    handleVerifyOtp(event){
    	var url = 'http://localhost:8080/users/verify';
    	var contact = this.state.contactNumber;
    	var otp = this.state.otp;
		var data = {contactNumber : contact, otp : otp};

		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(response => response.json())
                .then(response => {
                	if(response.verified === true){
                		this.setState({pageState: 'userVerified'})
            		}
            		else{
            			this.setState({pageState: 'otpVerficationFailed'})
            		}
                })
        event.preventDefault();
    }

    handleResendOtp(event){
    	var url = 'http://localhost:8080/otps/request';
    	var contact = this.state.contactNumber;
    	var data = {contactNumber : contact};
    	fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(response => {
        	if(response.status === 200){
        		this.setState({pageState: 'otpResendSuccessfull'})
        	}
        	else{
        		this.setState({pageState: 'otpResendFailed'})
        	}
        })
        event.preventDefault();
    }

    getErrorLabel(){
        if(this.state.pageState === 'signUpfailed'){
            return <label>signUpfailed : User already exists.</label>
        }
        else if(this.state.pageState === 'otpVerficationFailed'){
        	return <label>otpVerficationFailed : Invalid Otp entered. Please try again </label>
        }
        else if(this.state.pageState === 'otpResendSuccessfull'){
        	return <label>otpReSentSuccessfully : Otp has been sent successfully </label>
        }
        else if(this.state.pageState === 'otpResendFailed'){
        	return <label>otpResendFailed : Otp sending failed </label>
        }

    }


    
    render(){
        const pageState = this.state.pageState;
        const contact = this.state.contactNumber;        

    	if(pageState === 'signUp' || pageState === 'signUpfailed'){
    		return(
        		<form onSubmit = {this.handleSignUpSubmit}> 
	                <label>
	                    Enter your name
	                    <input type="text" name = "name" onChange = {this.handleChange}/>
	                </label>	                
					<br></br>
	                <label>
	                    Enter your mobile number
	                    <input type="tel" name = "contactNumber" onChange = {this.handleChange}/>
	                </label>    
	                
					<br></br>
	                <input type="submit" value="Sign Up"/>
	                {this.getErrorLabel()}
            	</form>
    		)
    	}

    	else if(pageState === 'verifyOtp' || pageState === 'otpVerficationFailed'
    	 || pageState === 'otpResendSuccessfull' || pageState === 'otpResendFailed'){
    		return(
                <form>
                    <label>Otp has sent to {contact} </label>
                    <br></br>
                    <label>Enter Otp</label>
                    <input type="number" name = "otp" onChange = {this.handleChange}/>
                    
					<br></br>
                    <input type="submit" value="Verify otp" onClick = {this.handleVerifyOtp}/>
                    
                    {this.getErrorLabel()}
					<br></br>
                    <input type="submit" value="Resend Otp" onClick = {this.handleResendOtp}/>
                </form>
        	)
    	}

    	else if(pageState === 'userVerified'){
    		return <label> You are now logged in! </label>
    	}
    }
}

export default App