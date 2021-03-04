import React from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import CrCard from "../components/CrCard";

function CR(props) {
  console.log(props);
  if (props.user.role === ("administrateur" || "responsable de projet"));

  return (
    <Container>
      <Row>
        {props.user.listeTacheCommencés.map((item) => {
          return <CrCard task={item._id} date={item.dateDebut}></CrCard>;
        })}
      </Row>
    </Container>
  );
}

export default CR;
