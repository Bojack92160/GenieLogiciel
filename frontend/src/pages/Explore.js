import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { makeStyles } from "@material-ui/core/styles";
import ClientDisplaySelection from "./../components/ClientDisplaySelection";
import ProjectDisplaySelection from "../components/ProjectDisplaySelection";
import CollabDisplaySelection from "../components/CollabDisplaySelection";
import IdDisplaySelection from "./../components/IdDisplaySelection";
import TaskDisplaySelection from "./../components/TaskDisplaySelection";

const useStyles = makeStyles({
  dropDown: {
    margin: "2rem auto",
    width: "90%",
    // marginLeft: auto,
    // marginRight: auto
  },
  test: {
    width: "100%",
  },
});

function Explore() {
  const classes = useStyles();

  const [searchMode, setSearchMode] = useState("Projects");
  const handleChange = (e) => {
    setSearchMode(e.target.value);
  };
  if (searchMode === "Clients") {
    return (
      <>
        <div className={classes.dropDown}>
          <Form.Group
            className={classes.test}
            controlId="exampleForm.ControlSelect1"
          >
            <Form.Control as="select" onChange={handleChange}>
              <option>Projets</option>
              <option>Tâches</option>
              <option>Utilisateurs</option>
              <option selected={true}>Clients</option>
              <option>Tout par ID</option>
            </Form.Control>
          </Form.Group>
        </div>

        <ClientDisplaySelection />
      </>
    );
  }
  if (searchMode === "Projets") {
    return (
      <>
        <div className={classes.dropDown}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Control as="select" onChange={handleChange}>
              <option selected={true}>Projets</option>
              <option>Tâches</option>
              <option>Utilisateurs</option>
              <option>Clients</option>
              <option>Tout par ID</option>
            </Form.Control>
          </Form.Group>
        </div>
        <ProjectDisplaySelection />
      </>
    );
  }
  if (searchMode === "Tâches") {
    return (
      <>
        <div className={classes.dropDown}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Control as="select" onChange={handleChange}>
              <option>Projets</option>
              <option selected={true}>Tâches</option>
              <option>Utilisateurs</option>
              <option>Clients</option>
              <option>Tout par ID</option>
            </Form.Control>
          </Form.Group>
        </div>
        <TaskDisplaySelection />
      </>
    );
  }
  if (searchMode === "Utilisateurs") {
    return (
      <>
        <div className={classes.dropDown}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Control as="select" onChange={handleChange}>
              <option>Projets</option>
              <option>Tâches</option>
              <option selected={true}>Utilisateurs</option>
              <option>Clients</option>
              <option>Tout par ID</option>
            </Form.Control>
          </Form.Group>
        </div>
        <CollabDisplaySelection />
      </>
    );
  }
  if (searchMode === "Tout par ID") {
    return (
      <>
        <div className={classes.dropDown}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Control as="select" onChange={handleChange}>
              <option>Projets</option>
              <option>Tâches</option>
              <option>Utilisateurs</option>
              <option>Clients</option>
              <option selected={true}>Tout par ID</option>
            </Form.Control>
          </Form.Group>
        </div>
        <IdDisplaySelection />
      </>
    );
  }

  return (
    <Form.Group controlId="exampleForm.ControlSelect1">
      <Form.Control as="select" onChange={handleChange}>
        <option>Projets</option>
        <option>Tâches</option>
        <option>Utilisateurs</option>
        <option>Clients</option>
        <option>Tout par ID</option>
      </Form.Control>
    </Form.Group>
  );
}

export default Explore;
