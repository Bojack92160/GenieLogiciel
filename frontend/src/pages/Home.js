import { React, useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import TaskList from "../components/TaskList";

import { FcTimeline } from "react-icons/fc";
//test pour voir comment importer des fonctions
import { test } from "../testfunc";
function yes(name) {
  console.log("yes");
}
function Home(props) {
  const [isGantt, setMode] = useState(false);
  const changeMode = () => setMode(!isGantt);
  const nom = "mathieu";
  if (isGantt) {
    return (
      <div className="home">
        {/* test pour voir comment marche des fonctions avec params */}
        <button
          onClick={() => {
            test(nom);
          }}
        ></button>
        <Container>
          <Row>
            <Col lg={4}>
              <div className="test">
                <button onClick={changeMode}>
                  <FcTimeline />
                </button>
              </div>
            </Col>
            <Col lg={4} />
            <Col lg={4} />
          </Row>
          <Row>
            <TaskList data={props.data} />
          </Row>
        </Container>
      </div>
    );
  } else {
    return (
      <div className="home">
        <Container>
          <Row>
            <Col lg={4}>
              <div className="test">
                <button onClick={changeMode}>
                  <FcTimeline />
                </button>
              </div>
            </Col>
            <Col lg={4} />
            <Col lg={4} />
          </Row>
          <Row>
            <Col sm={12} lg={4}>
              <div className="test"> gantt</div>
            </Col>
            <Col sm={12} lg={4}>
              <div className="test">col3</div>
            </Col>
            <Col sm={12} lg={4}>
              <div className="test">col3</div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
