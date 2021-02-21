import { React, useState, useEffect, useCallback } from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import ProgressBar from "react-bootstrap/ProgressBar";
import Loading2 from "./Loading2";
import Container from "react-bootstrap/esm/Container";
function GrosTaskList(props) {
  //console.log(props);
  const [state, setState] = useState({
    diving: true,
    subTasks: [],
    item: null,
    loading: false,
  });

  if (!props.tasks || props.tasks === 0) return <p>pas de taches3</p>;
  if (state.loading) {
    return <Loading2></Loading2>;
  }
  if (state.diving) {
    console.log("diving");
    return (
      <>
        {props.tasks.map((item, index) => {
          return (
            <Col lg={4} sm={12} key={index}>
              <Card
                style={{ marginTop: "10px" }}
                onClick={() => {
                  if (item.listeSousTaches.length > 0) {
                    const apiUrl =
                      "https://api.bojack.vercel.app/Recherche/Tache";
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    for (var i = 0; i < item.listeSousTaches.length; i++) {
                      setState({ loading: true, diving: true });
                      const id = { id: item.listeSousTaches[i] };
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
                          //console.log(data);
                          const yes = Object.assign({}, ...data);
                          console.log(yes);
                          var test = state.subTasks;
                          if (test) {
                            test.push(yes);
                          } else {
                            test = yes;
                          }
                          console.log(test);

                          //test.push(yes);
                          setState({
                            subTasks: test,
                            mode: state.mode,
                            loading: false,
                          });
                        });
                    }
                  }
                }}
              >
                <Card.Body>
                  <Card.Title>{item.titre}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    <Row>
                      <Col>Responsable: {item.responsable}</Col>
                      <Col>Réalisateur: {item.collaborateur}</Col>
                    </Row>
                  </Card.Subtitle>
                  <Card.Subtitle className="mb-12 text-muted">
                    <br />
                    {item.description}
                  </Card.Subtitle>
                  <Card.Text>
                    <Row>
                      <Col>Dates initiales:</Col>
                      <Col>
                        {new Date(item.dateDebutInit).toLocaleDateString()}
                      </Col>
                      <Col>
                        {new Date(item.dateFinInit).toLocaleDateString()}
                      </Col>
                    </Row>
                    <Row>
                      <Col>Dates effectives:</Col>
                      <Col>
                        {new Date(item.dateDebutEffect).toLocaleDateString()}
                      </Col>
                      <Col>
                        {new Date(item.dateFinEffect).toLocaleDateString()}
                      </Col>
                    </Row>
                    <Row>
                      <Col>Charge restante</Col>
                      <Col>{item.dataAvancement.chargeRestante}</Col>
                      <Col>
                        {new Date(item.dateFinEffect).toLocaleDateString()}
                      </Col>
                    </Row>
                  </Card.Text>
                  <Card.Text>
                    <ProgressBar
                      now={item.dataAvancement.pourcent}
                      label={`${item.dataAvancement.pourcent}%`}
                    />
                  </Card.Text>
                  <Card.Link href="#">Card Link</Card.Link>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </>
    );
  } else if (!state.loading) {
    return <GrosTaskList tasks={state.subTasks}></GrosTaskList>;
  }
}

export default GrosTaskList;
