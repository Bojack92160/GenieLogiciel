import { React } from "react";

import ProjectsList from "../components/ProjectsList";
import Container from "react-bootstrap/Container";
import * as AIIcons from "react-icons/ai";
function Projects(props) {
  console.log(props);
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
          <div
            style={{ position: "absolute", bottom: 10, right: 10 }}
            onClick={() => {
              alert("do stuff");
            }}
          >
            <AIIcons.AiFillPlusCircle></AIIcons.AiFillPlusCircle>
          </div>
        </>
      </Container>
    </div>
  );
}

export default Projects;
