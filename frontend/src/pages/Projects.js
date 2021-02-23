import { React, useState } from "react";

import ProjectsList from "../components/ProjectsList";
import Container from "react-bootstrap/Container";
import * as AIIcons from "react-icons/ai";
import "./test.css";
import ProjectForm from "../components/ProjectForm";

function Projects(props) {
  const [state, setstate] = useState({ isPro: false, addproj: false });
  const add = () => {
    setstate({ isPro: state.isPro, addproj: true });
  };
  console.log(props.Userdata.role);
  if (state.addproj) {
    return <ProjectForm></ProjectForm>;
  }
  if (!props.projects || props.projects.length === 0)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>pas de projets</p>
      </div>
    );
  if (
    props.Userdata.role === "administrateur" ||
    props.Userdata.role === "responsable de projet"
  ) {
    return (
      <div className="home">
        {/* test pour voir comment marche des fonctions avec params */}
        {/* <button
                onClick={() => {
                  test(nom);
                }}
              ></button> */}
        <Container>
          <>
            <ProjectsList tasks={props.projects} user={props.Userdata} />

            <div
              style={{ position: "fixed", bottom: 10, right: 20 }}
              onClick={() => {
                if (!state.isPro) {
                  console.log("on est en projet");
                  add();
                }
              }}
            >
              <AIIcons.AiFillPlusCircle
                className="test_hover"
                style={{ color: "#1a83ff" }}
                size={40}
              ></AIIcons.AiFillPlusCircle>
            </div>
          </>
        </Container>
      </div>
    );
  } else {
    return (
      <div className="home">
        {/* test pour voir comment marche des fonctions avec params */}
        {/* <button
                onClick={() => {
                  test(nom);
                }}
              ></button> */}
        <Container>
          <>
            <ProjectsList tasks={props.projects} />
          </>
        </Container>
      </div>
    );
  }
}

export default Projects;
