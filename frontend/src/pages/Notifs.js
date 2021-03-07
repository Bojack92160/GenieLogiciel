import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
function Notifs(props) {
  if (!props.notifs || props.notifs === 0)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spinner
          animation="border"
          variant="primary"
          style={{ width: "100px", height: "100px", fontSize: "50px" }}
        />
      </div>
    );

  return (
    <Container>
      <Row>
        {[...props.notifs].reverse().map((item, index) => {
          return (
            <Col lg={12} sm={12} key={index} style={{ marginTop: "10px" }}>
              <Card style={{ height: "100%" }}>
                <Card.Body>
                  <Card.Title>{item.contenu}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    <Row>
                      <Col>De: {item.de}</Col>
                      <Col>
                        Date: {new Date(item.date).toLocaleDateString()}
                      </Col>
                    </Row>
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default Notifs;
