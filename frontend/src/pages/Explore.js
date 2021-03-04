import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { makeStyles } from "@material-ui/core/styles";
import ClientDisplaySelection from "./../components/ClientDisplaySelection";
import ProjectDisplaySelection from "../components/ProjectDisplaySelection";
import UserDisplaySelection from "../components/UserDisplaySelection";
import IdDisplaySelection from "./../components/IdDisplaySelection";
import TaskDisplaySelection from "./../components/TaskDisplaySelection";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LensIcon from "@material-ui/icons/Lens";

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
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  flagContainer: {
    display: "flex",
    justifyContent: "center",
  },
});

function Explore() {
  const classes = useStyles();

  const [searchMode, setSearchMode] = useState("Projets");
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
        <Card className={classes.root}>
          <CardContent>
            <div className={classes.flagContainer}>
              <LensIcon color="primary" />
              <span>projet terminé </span>
            </div>
            <div className={classes.flagContainer}>
              <LensIcon color="secondary" />
              <span>projet en cours </span>
            </div>
          </CardContent>
        </Card>
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
        <UserDisplaySelection />
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
