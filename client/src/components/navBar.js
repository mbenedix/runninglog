import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react'
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
    <div>
      <Menu stackable>
         
        <Menu.Item
          name='profile'
          active={activeItem === 'profile'}
          onClick={handleItemClick}
          href='/profile'
        >
         || Profile |
        </Menu.Item>
        
        
        <Menu.Item
          name='saverun'
          active={activeItem === 'saverun'}
          onClick={handleItemClick}
          href='/logrun'
        >
          | Log Run | 
        </Menu.Item>

        <Menu.Item
          name='register'
          active={activeItem === 'input'}
          onClick={handleItemClick}
          href='/register'
        >
         |  Register |
        </Menu.Item>
        
        <Menu.Item
          name='login'
          active={activeItem === 'login'}
          onClick={handleItemClick}
          href='/login'
        >
         | Login |
        </Menu.Item>
        
        <Menu.Item
          name='logout'
          active={activeItem === 'login'}
          onClick={logOut}
          href='/login'
        >
         | Logout ||
        </Menu.Item>
  
      </Menu>

      {auth.user}

      </div>
    )
  }


export default NavBar