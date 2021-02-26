import { React, useState, useEffect } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Chart } from "react-google-charts";
import { FcTimeline } from "react-icons/fc";
import Loading2 from "./Loading2";
import GrosTaskList from "./GrosTaskList";
import * as AIIcons from "react-icons/ai";
import TaskForm from "./TaskForm";
function Project(props) {
  console.log("cette page");
  console.log(props);
  const [state, setState] = useState({
    mode: false,
    loading: false,
    tasks: [],
    tasksObj: [],
  });
  useEffect(() => {
    setState({
      loading: true,
      mode: state.mode,
      tasks: state.tasks,
      isPro2: true,
      add: false,
    });
    const apiUrl = "http://localhost:3001/Recherche/Tache";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    setState({ loaging: false });
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
          const yes = Object.assign({}, ...data);
          //console.log(yes);
          var test = state.tasks;
          test.push(yes);

          setState({
            tasks: test,
            mode: state.mode,
            loading: false,
          });
        });
    }
  }, [setState]);
  useEffect(() => {
    setState({
      mode: state.mode,
      loading: true,
      tasks: state.tasks,
      isPro2: state.isPro2,
      add: state.add,
    });
    const apiUrl = "http://localhost:3001/Recherche/AllProjet";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const id = { id: props.project._id };
    const raw = JSON.stringify(id);

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
      });
  }, [setState]);
  //console.log(state.tasks);
  const changeMode = () =>
    setState({ mode: !state.mode, loading: state.loading, tasks: state.tasks });
  if (state.add) {
    return <TaskForm project={props.project}></TaskForm>;
  } else if (state.loading) {
    return <Loading2></Loading2>;
  } else if (!state.tasks || state.tasks === 0) {
    if (props.user.email === props.project.responsable) {
      return (
        <>
          <p>pas de taches dans le proj</p>
          <div
            className="test_hover"
            style={{ position: "fixed", bottom: 10, right: 20, zIndex: 1 }}
            onClick={() => {
              if (!state.isPro2) {
                setState({ add: true, tasks: state.tasks });
                console.log("on est en tache");
              }
            }}
          >
            <AIIcons.AiFillPlusCircle
              style={{ color: "red" }}
              size={40}
            ></AIIcons.AiFillPlusCircle>
          </div>
        </>
      );
    } else {
      return <p>pas de taches dans le proj</p>;
    }
  } else if (state.mode) {
    if (!props.user.email === props.project.responsable) {
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
              <GrosTaskList
                project={props.project}
                tasks={state.tasks}
                user={props.user}
              />
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
              <GrosTaskList
                project={props.project}
                tasks={state.tasks}
                user={props.user}
              />
            </Row>
            <div
              className="test_hover"
              style={{ position: "fixed", bottom: 10, right: 20, zIndex: 1 }}
              onClick={() => {
                if (!state.isPro2) {
                  setState({ add: true, tasks: state.tasks });
                  console.log("on est en tache");
                }
              }}
            >
              <AIIcons.AiFillPlusCircle
                style={{ color: "red" }}
                size={40}
              ></AIIcons.AiFillPlusCircle>
            </div>
          </Container>
        </div>
      );
    }
  } else if (props.user.email === props.project.responsable) {
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
          <div
            className="test_hover"
            style={{ position: "fixed", bottom: 10, right: 20, zIndex: 1 }}
            onClick={() => {
              if (!state.isPro2) {
                setState({ add: true, tasks: state.tasks });
                console.log("on est en tache");
              }
            }}
          >
            <AIIcons.AiFillPlusCircle
              style={{ color: "red" }}
              size={40}
            ></AIIcons.AiFillPlusCircle>
          </div>
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
          <div
            className="test_hover"
            style={{ position: "fixed", bottom: 10, right: 20, zIndex: 1 }}
            onClick={() => {
              if (!state.isPro2) {
                setState({ add: true, tasks: state.tasks });
                console.log("on est en tache");
              }
            }}
          >
            <AIIcons.AiFillPlusCircle
              style={{ color: "#red" }}
              size={40}
            ></AIIcons.AiFillPlusCircle>
          </div>
        </Container>
      </div>
    );
  }
}

export default Project;
