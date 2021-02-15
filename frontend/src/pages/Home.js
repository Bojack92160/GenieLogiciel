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
  const [isGantt, setMode] = useState(false);
  const changeMode = () => setMode(!isGantt);
  // const nom = "mathieu";
  //console.log(props.data);
  if (isGantt) {
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
            <Col lg={12}>
              <Chart
                width={"100%"}
                height={"400px"}
                chartType="Gantt"
                loader={<div>Loading Chart</div>}
                data={[
                  [
                    { type: "string", label: "Task ID" },
                    { type: "string", label: "Task Name" },
                    { type: "date", label: "Start Date" },
                    { type: "date", label: "End Date" },
                    { type: "number", label: "Duration" },
                    { type: "number", label: "Percent Complete" },
                    { type: "string", label: "Dependencies" },
                  ],
                  [
                    "Research",
                    "Find sources",
                    new Date(2015, 0, 1),
                    new Date(2015, 0, 5),
                    null,
                    100,
                    null,
                  ],
                  [
                    "Research2",
                    "Find sources",
                    new Date(2015, 0, 1),
                    new Date(2015, 0, 6),
                    null,
                    100,
                    null,
                  ],

                  [
                    "Write",
                    "Write paper",
                    null,
                    new Date(2015, 0, 9),
                    3 * 24 * 60 * 60 * 1000,
                    25,
                    "Research,Outline",
                  ],
                  [
                    "Cite",
                    "Create bibliography",
                    null,
                    new Date(2015, 0, 7),
                    1 * 24 * 60 * 60 * 1000,
                    20,
                    "Research",
                  ],
                  [
                    "Complete",
                    "Hand in paper",
                    null,
                    new Date(2015, 0, 10),
                    1 * 24 * 60 * 60 * 1000,
                    0,
                    "Cite,Write",
                  ],
                  [
                    "Outline",
                    "Outline paper",
                    null,
                    new Date(2015, 0, 6),
                    1 * 24 * 60 * 60 * 1000,
                    100,
                    "Research",
                  ],
                ]}
                rootProps={{ "data-testid": "1" }}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
