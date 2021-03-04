import { React, useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
function CrCard(props) {
  const [state, setstate] = useState({});
  useEffect(() => {
    const apiUrl = "http://localhost:3001/Recherche/Tache";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ id: props.task });
    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(apiUrl, reqOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setstate(data[0]);
      });
  }, [setstate]);
  return (
    <Col lg={6} sm={12}>
      <Card>
        <Card.Body>
          <Card.Title>{state.titre}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <Card.Link href="#">Card Link</Card.Link>
          <Card.Link href="#">Another Link</Card.Link>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default CrCard;
