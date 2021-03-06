import { React, useState } from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import Project from "./Project";
function ProjectsList(props) {
  const [state, setstate] = useState({ mode: false, item: null });
  const changeMode = (item) => {
    setstate({ mode: true, item: item });
  };
  if (!props.tasks || props.tasks === 0) return <p>pas de taches</p>;
  if (!state.mode) {
    return (
      <>
        <Row>
          {props.tasks.map((item, index) => {
            return (
              <Col lg={4} sm={12} key={index}>
                <Card style={{ marginTop: "10px" }}>
                  <Card.Body>
                    <Card.Title>{item.titre}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      <Row>
                        <Col>Responsable: {item.responsable}</Col>
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
                    </Card.Text>
                    <Card.Text>
                      <ProgressBar
                        now={item.dataAvancement.pourcent * 100}
                        label={`${(item.dataAvancement.pourcent * 100).toFixed(
                          2
                        )}%`}
                      />
                    </Card.Text>
                    <Button
                      onClick={() => {
                        changeMode(item);
                      }}
                    >
                      détails
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </>
    );
  } else {
    return <Project project={state.item} user={props.user}></Project>;
  }
}

export default ProjectsList;
