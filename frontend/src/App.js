import "./App.css";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Container fluid>
          <Row>
            <Col sm={4} lg={12}>
              col 10
            </Col>
            <Col sm={4} lg={12}>
              col 1
            </Col>
            <Col sm={4} lg={12}>
              col 2
            </Col>
          </Row>
        </Container>
        <Button variant="primary">Primary</Button>{" "}
      </header>
    </div>
  );
}

export default App;
