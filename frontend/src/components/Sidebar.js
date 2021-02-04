import React, { useState } from "react";
import * as FAIcons from "react-icons/fa";
import * as AIIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SideBarData } from "./SideBarData";
import "./Sidebar.css";
import { IconContext } from "react-icons";
function Sidebar() {
  const [sideBar, setSideBar] = useState(false);
  const showSideBar = () => setSideBar(!sideBar);
  return (
    <>
      <IconContext.Provider value={{ color: "#5060b8" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FAIcons.FaBars onClick={showSideBar} />
          </Link>
        </div>
        <nav className={sideBar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSideBar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AIIcons.AiOutlineClose />
              </Link>
            </li>
            {SideBarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Sidebar;
