import React, { useState, useEffect, useCallback } from "react";
import Form from "react-bootstrap/Form";

function Explore() {
  const [searchMode, setSearchMode] = useState("Projects");
  const handleChange = (e) => {
    setSearchMode(e.target.value);
  };
  if (searchMode === "Clients") {
    return (
      <>
        <div>Clients</div>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Control as="select" onChange={handleChange}>
            <option>Projets</option>
            <option>Tâches</option>
            <option>Utilisateurs</option>
            <option selected={true}>Clients</option>
            <option>Tout par ID</option>
          </Form.Control>
        </Form.Group>
      </>
    );
  }
  if (searchMode === "Projets") {
    return (
      <>
        <div>Projets</div>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Control as="select" onChange={handleChange}>
            <option selected={true}>Projets</option>
            <option>Tâches</option>
            <option>Utilisateurs</option>
            <option>Clients</option>
            <option>Tout par ID</option>
          </Form.Control>
        </Form.Group>
      </>
    );
  }
  if (searchMode === "Tâches") {
    return (
      <>
        <div>Tâches</div>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Control as="select" onChange={handleChange}>
            <option>Projets</option>
            <option selected={true}>Tâches</option>
            <option>Utilisateurs</option>
            <option>Clients</option>
            <option>Tout par ID</option>
          </Form.Control>
        </Form.Group>
      </>
    );
  }
  if (searchMode === "Utilisateurs") {
    return (
      <>
        <div>Utilisateurs</div>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Control as="select" onChange={handleChange}>
            <option>Projets</option>
            <option>Tâches</option>
            <option selected={true}>Utilisateurs</option>
            <option>Clients</option>
            <option>Tout par ID</option>
          </Form.Control>
        </Form.Group>
      </>
    );
  }
  if (searchMode === "Tout par ID") {
    return (
      <>
        <div>Tout par ID</div>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Control as="select" onChange={handleChange}>
            <option>Projets</option>
            <option>Tâches</option>
            <option>Utilisateurs</option>
            <option>Clients</option>
            <option selected={true}>Tout par ID</option>
          </Form.Control>
        </Form.Group>
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
