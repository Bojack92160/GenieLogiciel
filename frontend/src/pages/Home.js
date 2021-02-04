import React from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

function Home() {
  return (
    <div className="home">
      <Container>
        <Row>
          <Col sm={12} lg={4}>
            <div className="test">col3</div>
          </Col>
          <Col sm={12} lg={4}>
            <div className="test">col3</div>
          </Col>
          <Col sm={12} lg={4}>
            <div className="test">col3</div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
