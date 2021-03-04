import React from "react";
import * as FAIcons from "react-icons/fa";
import * as AIIcons from "react-icons/ai";
import * as BIIcons from "react-icons/bi";

export const SideBarData = [
  {
    title: "Mes tâches",
    path: "/",
    icon: <FAIcons.FaTasks />,
    cName: "nav-text",
  },
  {
    title: "Mes projets",
    path: "/projects",
    icon: <AIIcons.AiOutlineProject />,
    cName: "nav-text",
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: <AIIcons.AiOutlineBell />,
    cName: "nav-text",
  },
  {
    title: "Explorer",
    path: "/explore",
    icon: <AIIcons.AiOutlineSearch />,
    cName: "nav-text",
  },
  {
    title: "Compte rendu",
    path: "/cr",
    icon: <BIIcons.BiTask />,
    cName: "nav-text",
  },
  {
    title: "Paramètres",
    path: "/settings",
    icon: <FAIcons.FaCogs />,
    cName: "nav-text",
  },
];
