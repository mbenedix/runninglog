import React, { Component } from 'react'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          apiResponse: "",
          inputUser: "",
          inputPass: "",
          creds: {user: "", pass: ""}
      
      };
        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.saveCreds = this.saveCreds.bind(this);
        this.toBackend = this.toBackend.bind(this);
      }
    
      handleUserChange(event) {
        this.setState({
          inputUser: event.target.value
        });
      }
    
      handlePassChange(event) {
        this.setState({
          inputPassword: event.target.value
        });
      }
      saveCreds(event) {
        event.preventDefault();
        console.log(this.state.inputUser);
        
        this.setState((state, props) => ({
          personToSave: {
            name: state.inputUser,
            age: state.inputPassword 
          }
        }), this.toBackend);
        
      }
    
      toBackend () {
        let data = this.state.creds;
        console.log(data);
        fetch('http://localhost:9000/login', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          })
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
      
      componentDidMount() {
        return;
      }
      
      render() {
        return (
          <div>
            <h1>LOGIN HERE</h1>
            <form onSubmit={this.saveCreds}>
              <input type="text" value={this.state.inputUser} onChange = {this.handleUserChange} placeholder="name" /> <br />
              <input type="text" value={this.state.inputPassword} onChange = {this.handlePassChange} placeholder="age" /> <br />
              <input type="submit" value="Login" />
            </form>
          </div>
        );
      }
    }
    


export default Login;