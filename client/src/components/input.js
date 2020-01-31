import React, { Component } from 'react'

class Input extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          apiResponse: "",
          inputName: "",
          inputAge: "",
          personToSave: {name: "", age: ""}
      
      };
        
        //this.calltest = this.calltest.bind(this);
        this.handleAgeChange = this.handleAgeChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.saveperson = this.saveperson.bind(this);
        this.toBackend = this.toBackend.bind(this);
      }
    
      handleNameChange(event) {
        this.setState({
          inputName: event.target.value
        });
      }
    
      handleAgeChange(event) {
        this.setState({
          inputAge: event.target.value
        });
      }
      saveperson(event) {
        event.preventDefault();
        console.log(this.state.inputName);
        
        this.setState((state, props) => ({
          personToSave: {
            name: state.inputName,
            age: state.inputAge 
          }
        }), this.toBackend);
        
      }
    
      toBackend () {
        let data = this.state.personToSave;
        console.log(data);
        fetch('http://localhost:9000/testapi', {
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
            <form onSubmit={this.saveperson}>
              <input type="text" value={this.state.inputName} onChange = {this.handleNameChange} placeholder="name" /> <br />
              <input type="text" value={this.state.inputAge} onChange = {this.handleAgeChange} placeholder="age" /> <br />
              <input type="submit" value="Save Person" />
            </form>
          </div>
        );
      }
    }
    


export default Input;