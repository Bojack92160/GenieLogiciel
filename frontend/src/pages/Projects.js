import { React } from "react";

import Container from "react-bootstrap/Container";
import ProjectsList from "../components/ProjectsList";

function Projects(props) {
  // const nom = "mathieu";
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
        </>
      </Container>
    </div>
  );
}

export default Projects;
