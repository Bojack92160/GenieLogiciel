import { React, useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import CrCard from "../components/CrCard";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

function CR(props) {
  const [state, setstate] = useState([]);
  const [mode, setMode] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [crs, setCRs] = useState([]);
  const changeMode = () => {
    setMode(!mode);
  };
  const handleChange = (e) => {
    setRecherche(e.target.value);
  };
  useEffect(() => {
    setstate([]);
    for (const id of props.user.listeTacheCommences) {
      const apiUrl = "http://localhost:3001/Recherche/Tache";
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({ id: id });
      var reqOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch(apiUrl, reqOptions)
        .then((res) => res.json())
        .then((data) => {
          data = Object.assign({}, ...data);

          setstate((state) => [...state, data]);
        });
    }
  }, [setstate]);

  if (props.user.role === ("administrateur" || "responsable de projet")) {
    if (mode) {
      if (crs.length === 0) {
        return (
          <Container>
            <Row>
              <Button onClick={changeMode}></Button>
            </Row>
            <Row>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>
                  Recherche des comptes rendus d'utilisateurs
                </Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Utilisateur"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col>
                    <Button
                      onClick={() => {
                        const body = { email: recherche };
                        const apiUrl =
                          "http://localhost:3001/Recherche/Rapports";
                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        var raw = JSON.stringify(body);

                        var reqOptions = {
                          method: "POST",
                          headers: myHeaders,
                          body: raw,
                          redirect: "follow",
                        };
                        fetch(apiUrl, reqOptions)
                          .then((res) => res.json())
                          .then((data) => {
                            setCRs(data);
                          });
                      }}
                    >
                      Recherche
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Row>
          </Container>
        );
      } else {
        return (
          <>
            <Container>
              <Row>
                <Button onClick={changeMode}>2</Button>
              </Row>
              <Row>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Utilisateur</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="Utilisateur"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <Button
                        onClick={() => {
                          const body = { email: recherche };
                          const apiUrl =
                            "http://localhost:3001/Recherche/Rapports";
                          var myHeaders = new Headers();
                          myHeaders.append("Content-Type", "application/json");
                          var raw = JSON.stringify(body);

                          var reqOptions = {
                            method: "POST",
                            headers: myHeaders,
                            body: raw,
                            redirect: "follow",
                          };
                          fetch(apiUrl, reqOptions)
                            .then((res) => res.json())
                            .then((data) => {
                              setCRs(data);
                            });
                        }}
                      >
                        Recherche
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Row>
              <Row>
                {crs.map((item) => {
                  return (
                    <Col lg={12} sm={12}>
                      <Card>
                        <Card.Body>
                          <Card.Title>{item._idTache}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            {item.emailUtilisateur}
                          </Card.Subtitle>
                          <Card.Text>
                            <Row>
                              <Col>
                                Début de la période:
                                {new Date(
                                  item.periodeDebut
                                ).toLocaleDateString()}
                              </Col>
                              <Col>
                                Fin de la période:
                                {new Date(item.periodeFin).toLocaleDateString()}
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                Date de Saisie:
                                {new Date(
                                  item.dateDeSaisie
                                ).toLocaleDateString()}
                              </Col>
                            </Row>

                            <Row>
                              <Col>Charge effectuée:{item.chargeEffectue}</Col>
                              <Col>Charge Restante:{item.chargeRestante}</Col>
                            </Row>
                            <Row>
                              <Col>
                                Avancement effectué:
                                {item.avancementEffectue * 100}%
                              </Col>
                            </Row>
                            <Row>
                              <Col>{item.commentaire}</Col>
                            </Row>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Container>
          </>
        );
      }
    } else {
      return (
        <Container>
          <Row>
            <Button onClick={changeMode}></Button>
          </Row>
          <Row>
            {state.map((item) => {
              return (
                <>
                  <CrCard task={item} user={props.user}></CrCard>
                </>
              );
            })}
          </Row>
        </Container>
      );
    }
  } else {
    return (
      <Container>
        <Row>
          {state.map((item) => {
            return (
              <>
                <CrCard task={item} user={props.user}></CrCard>
              </>
            );
          })}
        </Row>
      </Container>
    );
  }
}

export default CR;
