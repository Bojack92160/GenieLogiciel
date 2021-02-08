import { React, useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import TaskList from "../components/TaskList";
import { TasksData } from "../components/TasksData";
function Home() {
  const [isGantt, setMode] = useState(false);
  const changeMode = () => setMode(!isGantt);
  if (isGantt) {
    return (
      <div className="home">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="test">
                <button className="test" onClick={changeMode}></button>
              </div>
            </Col>
          </Row>
          <Row>
            <TaskList data={TasksData} />
          </Row>
        </Container>
      </div>
    );
  } else {
    return (
      <div className="home">
        <Container>
          <Row>
            <Col lg={4} />

            <Col lg={4}>
              <div className="test">
                <button onClick={changeMode}></button>
              </div>
            </Col>
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
