import React from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import ProgressBar from "react-bootstrap/ProgressBar";
function TaskList(props) {
  var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
  if (!props.tasks || props.tasks === 0) return <p>pas de taches</p>;
  return (
    <>
      {props.tasks.map((item, index) => {
        console.log(item);
        return (
          <Col lg={4} sm={12} key={index}>
            <Card style={{ marginTop: "10px" }}>
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
                    <Col>{new Date(item.dateFinInit).toLocaleDateString()}</Col>
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
}

export default TaskList;
