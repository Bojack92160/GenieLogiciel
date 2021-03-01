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
    tasksObj: [
      [
        { type: "string", label: "Task ID" },
        { type: "string", label: "Task Name" },
        { type: "date", label: "Start Date" },
        { type: "date", label: "End Date" },
        { type: "number", label: "Duration" },
        { type: "number", label: "Percent Complete" },
        { type: "string", label: "Dependencies" },
      ],
    ],
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
        var dt = state.tasksObj;

        data.map((item, index) => {
          console.log(item);
          if (index !== 0) {
            const test = [
              item._id.toString(),
              item.titre,
              new Date(item.dateDebutInit),
              new Date(item.dateFinInit),
              null,
              parseInt(item.dataAvancement.pourcent) * 100,
              item.prédécesseurs.toString(),
            ];

            dt.push(test);
          }

          setState({
            tasksObj: dt,
            mode: state.mode,
            loading: state.loading,
            tasks: state.tasks,
            isPro2: state.isPro2,
          });

          return null;
        });
      });
  }, [setState]);
  //console.log(state.tasks);
  const changeMode = () =>
    setState({
      mode: !state.mode,
      loading: state.loading,
      tasks: state.tasks,
      tasksObj: state.tasksObj,
    });
  if (!state.tasks || state.tasks.length === 0) {
    if (state.loading) {
      return <Loading2></Loading2>;
    }
    if (props.user.email === props.project.responsable) {
      if (state.add) {
        return (
          <TaskForm
            project={state.tasksObj}
            user={props.user}
            projectInfo={props.project}
          ></TaskForm>
        );
      }

      return (
        <>
          <p
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            ce projet est vide
          </p>
          <div
            className="test_hover"
            style={{ position: "fixed", bottom: 10, right: 20, zIndex: 1 }}
            onClick={() => {
              if (!state.isPro2) {
                setState({
                  add: true,
                  tasks: state.tasks,
                  tasksObj: state.tasksObj,
                });
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
      return <p>Ce Projet est vide</p>;
    }
  } else {
    if (state.loading) {
      return <Loading2></Loading2>;
    }
    if (state.mode) {
      if (state.add) {
        return (
          <TaskForm
            project={state.tasksObj}
            user={props.user}
            projectInfo={props.project}
          ></TaskForm>
        );
      }
      if (props.user.email !== props.project.responsable) {
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
                    setState({
                      add: true,
                      tasks: state.tasks,
                      tasksObj: state.tasksObj,
                    });
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
    } else {
      if (state.add) {
        return (
          <TaskForm
            project={state.tasksObj}
            user={props.user}
            projectInfo={props.project}
          ></TaskForm>
        );
      }
      if (props.user.email === props.project.responsable) {
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
                    height={state.tasksObj?.length * 40}
                    chartType="Gantt"
                    loader={<div>Loading Chart</div>}
                    data={state.tasksObj}
                    options={{
                      criticalPathEnabled: true,
                    }}
                    rootProps={{ "data-testid": "1" }}
                  />
                </Col>
              </Row>
              <div
                className="test_hover"
                style={{ position: "fixed", bottom: 10, right: 20, zIndex: 1 }}
                onClick={() => {
                  if (!state.isPro2) {
                    setState({
                      add: true,
                      tasks: state.tasks,
                      tasksObj: state.tasksObj,
                    });
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
                    height={state.tasksObj?.length * 4}
                    chartType="Gantt"
                    loader={<div>Loading Chart</div>}
                    data={state.tasksObj}
                    options={{
                      criticalPathEnabled: true,
                    }}
                    rootProps={{ "data-testid": "1" }}
                  />
                </Col>
              </Row>
            </Container>
          </div>
        );
      }
    }
  }
}

export default Project;
