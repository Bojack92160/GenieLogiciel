import React from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
function TaskList(props) {
  if (!props.data || props.data === 0) return <p>pas de taches</p>;
  return (
    <>
      {props.data.map((item, index) => {
        return (
          <Col lg={4} sm={12} key={index}>
            <Card style={{ marginTop: "10px" }}>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Card Subtitle
                </Card.Subtitle>
                <Card.Text>
                  {item.debut}
                  {item.fin}
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
