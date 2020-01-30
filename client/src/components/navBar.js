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
        <ul>
          <li>
        <Menu.Item
          name='output'
          active={activeItem === 'output'}
          onClick={this.handleItemClick}
          href='/output'
        >
          Output
        </Menu.Item>
        </li>
        <li>
        <Menu.Item
          name='input'
          active={activeItem === 'input'}
          onClick={this.handleItemClick}
          href='/input'
        >
          Input
        </Menu.Item>
        </li>

        <li>
        <Menu.Item
          name='protected'
          active={activeItem === 'input'}
          onClick={this.handleItemClick}
          href='/protected'
        >
          Protected
        </Menu.Item>
        </li>

        <li>
        <Menu.Item
          name='login'
          active={activeItem === 'login'}
          onClick={this.handleItemClick}
          href='/login'
        >
          Login
        </Menu.Item>
        </li>
       </ul>
        
      </Menu>
    )
  }
}

export default NavBar