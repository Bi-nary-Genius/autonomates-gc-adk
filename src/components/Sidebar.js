import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { IoHome } from "react-icons/io5"; // Import only used icons

function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <IoHome size={22} />
            <span>Home</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
