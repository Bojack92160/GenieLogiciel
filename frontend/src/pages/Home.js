import { React, useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import TaskList from "../components/TaskList";
import { Chart } from "react-google-charts";
import { FcTimeline } from "react-icons/fc";
//test pour voir comment importer des fonctions
//import { test } from "../testfunc";

// function yes(name) {
//   console.log("yes");
// }
function Home(props) {
  // const nom = "mathieu";
  //console.log(props.data);

  return (
    <div className="home">
      {/* test pour voir comment marche des fonctions avec params */}
      {/* <button
          onClick={() => {
            test(nom);
          }}
        ></button> */}
      <Container>
        <Row>
          <TaskList tasks={props.tasks} />
        </Row>
      </Container>
    </div>
  );
}

export default Home;
