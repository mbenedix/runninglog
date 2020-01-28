import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
//import logo from '../logo.svg'

class NavBar extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu stackable>
       {/* <Menu.Item>
          <img src={logo} alt="Froggo"/>
       </Menu.Item> */}

        <Menu.Item
          name='output'
          active={activeItem === 'output'}
          onClick={this.handleItemClick}
          href='/output'
        >
          Output
        </Menu.Item>

        <Menu.Item
          name='input'
          active={activeItem === 'input'}
          onClick={this.handleItemClick}
          href='/input'
        >
          Input
        </Menu.Item>


        
      </Menu>
    )
  }
}

export default NavBar