import { React, useState, useEffect } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Chart } from "react-google-charts";
import { FcTimeline } from "react-icons/fc";
import Loading2 from "./Loading2";
import GrosTaskList from "./GrosTaskList";
function Project(props) {
  const [state, setState] = useState({
    mode: false,
    loading: false,
    tasks: [],
  });
  useEffect(() => {
    setState({ loading: true, mode: state.mode, tasks: state.tasks });
    const apiUrl = "https://api.bojack.vercel.app/Recherche/Tache";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    for (const elem of props.project.listeSousTaches) {
      setState({ loading: true });
      const id = { id: elem };
      const raw = JSON.stringify(id);
      var reqOptions = {
        method: "POST",
        headers: myHeaders,
        mode: "cors",
        body: raw,
        redirect: "follow",
      };
      fetch(apiUrl, reqOptions)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          const yes = Object.assign({}, ...data);
          var test = state.tasks;
          test.push(yes);
          setState({
            tasks: test,
            mode: state.mode,
            loading: false,
          });
        })
        .then(() => {});
    }
  }, [setState, props.project.listeSousTaches, state.mode, state.tasks]);
  //console.log(state.tasks);
  const changeMode = () =>
    setState({ mode: !state.mode, loading: state.loading, tasks: state.tasks });
  if (state.loading) {
    return <Loading2></Loading2>;
  } else if (!state.tasks || state.tasks === 0) {
    return <p>pas de taches dans le proj</p>;
  } else if (state.mode) {
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
            <GrosTaskList tasks={state.tasks} />
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

export default Project;
