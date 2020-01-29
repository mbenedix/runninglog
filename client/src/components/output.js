import React, { Component } from 'react'

class Output extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            nameInput: "",
            person: {favoriteFoods: []}
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.saveName = this.saveName.bind(this);
        this.toBackend = this.toBackend.bind(this);
        this.storePerson = this.storePerson.bind(this);
    }

    dummyFun = () =>
    {
        console.log("made it!");
    }
    handleNameChange(event) {
        this.setState({
          nameInput: event.target.value
        });
      }

      saveName(event) {
        event.preventDefault();
        //console.log(this.state.nameInput);
        
        this.setState((state, props) => ({
            name: state.nameInput,   
        }), this.toBackend);
        
      }

      toBackend () {
        let targetName = this.state.name;
        console.log(targetName);
        
        fetch('http://localhost:9000/findperson', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({name: targetName}),
          })
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);
            this.storePerson(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
      storePerson(retPerson) {
        console.log(retPerson);
        this.setState((state, props) => ({
            person: retPerson   
        }), this.dummyFun);
      }
    render() {
        const foods = this.state.person.favoriteFoods.map((x, i) => <h3 key={i}> {x} </h3>)
        return (
            <div>
            <form onSubmit={this.saveName}>
              <input type="text" value={this.state.nameInput} onChange = {this.handleNameChange} placeholder="name" /> <br />
              <input type="submit" value= "Find Person" />
            </form>

            <h1>{this.state.person.name}</h1>
            <h2>{this.state.person.age}</h2>
            {foods}
          </div>
        );
    }
}


export default Output;