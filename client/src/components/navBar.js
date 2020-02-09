import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react'
//import logo from '../logo.svg'
import { useAuth } from '../context/auth';


function NavBar(props){

  const [activeItem, setActiveItem] = useState();
  const auth = useAuth();
  
  const handleItemClick = (e, name) => setActiveItem(name);
  
  const logOut = () => {
    auth.setJWT("");
    localStorage.clear();
    
  }
  
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
          onClick={handleItemClick}
          href='/output'
        >
          Output
        </Menu.Item>
        </li>
        <li>
        <Menu.Item
          name='input'
          active={activeItem === 'input'}
          onClick={handleItemClick}
          href='/input'
        >
          Input
        </Menu.Item>
        </li>

        <li>
        <Menu.Item
          name='register'
          active={activeItem === 'input'}
          onClick={handleItemClick}
          href='/register'
        >
          Register
        </Menu.Item>
        </li>
      

        <li>
        <Menu.Item
          name='login'
          active={activeItem === 'login'}
          onClick={handleItemClick}
          href='/login'
        >
          Login
        </Menu.Item>
        </li>
        <li>
        <Menu.Item
          name='login'
          active={activeItem === 'logout'}
          onClick={logOut}
          href='/login'
        >
          Logout
        </Menu.Item>
        </li>
        
        
       </ul>
       
        
      </Menu>
    )
  }


export default NavBar