import { React, useState } from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import ProgressBar from "react-bootstrap/ProgressBar";
import GrosTaskList from "./GrosTaskList";
import Button from "react-bootstrap/Button";
function TaskList(props) {
  const [state, setstate] = useState({ diving: true });
  const [listetaches, setListeTache] = useState([]);
  const addToStart = (e) => {
    const id = e.target.id;
    const userid = props.user._id;
    const apiUrl = "http://localhost:3001/Action/CommenceTache";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const user = { _idTache: id, _idUtilisateur: userid };
    var raw = JSON.stringify(user);
    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(apiUrl, reqOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          e.target.style.background = "#ffc107";
          alert("Vous avez commencé à travailler sur la tâche");
        } else {
          alert(data.erreur);
        }
      });
  };
  if (!props.tasks || props.tasks === 0) return <p>pas de taches3</p>;
  if (state.diving) {
    return (
      <>
        {props.tasks.map((item, index) => {
          if (props.user.email === item.collaborateur) {
            if (
              props.user.listeTacheCommences.find(
                (elem) => elem._id === item._id
              )
            ) {
              return (
                <Col lg={4} sm={12} key={index}>
                  <Card style={{ marginTop: "10px" }} onClick={() => {}}>
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
                            {new Date(
                              item.dateDebutEffect
                            ).toLocaleDateString()}
                          </Col>
                          <Col>
                            {new Date(item.dateFinEffect).toLocaleDateString()}
                          </Col>
                        </Row>
                        <Row>
                          <Col>Charge restante</Col>
                          <Col>{item.dataAvancement.chargeRestante}</Col>
                          <Col>Date de fin prévue:</Col>
                          <Col>
                            {new Date(item.dateFinEffect).toLocaleDateString()}
                          </Col>
                        </Row>
                      </Card.Text>
                      <Card.Text>
                        <ProgressBar
                          now={item.dataAvancement.pourcent * 100}
                          label={`${(
                            item.dataAvancement.pourcent * 100
                          ).toFixed(2)}%`}
                        />
                      </Card.Text>
                      <Button variant={"warning"}></Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            } else {
              return (
                <Col lg={4} sm={12} key={index}>
                  <Card style={{ marginTop: "10px" }} onClick={() => {}}>
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
                            {new Date(
                              item.dateDebutEffect
                            ).toLocaleDateString()}
                          </Col>
                          <Col>
                            {new Date(item.dateFinEffect).toLocaleDateString()}
                          </Col>
                        </Row>
                        <Row>
                          <Col>Charge restante</Col>
                          <Col>{item.dataAvancement.chargeRestante}</Col>
                          <Col>Date de fin prévue:</Col>
                          <Col>
                            {new Date(item.dateFinEffect).toLocaleDateString()}
                          </Col>
                        </Row>
                      </Card.Text>
                      <Card.Text>
                        <ProgressBar
                          now={item.dataAvancement.pourcent * 100}
                          label={`${(
                            item.dataAvancement.pourcent * 100
                          ).toFixed(2)}%`}
                        />
                      </Card.Text>
                      <Button id={item._id} onClick={addToStart}></Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            }
          } else {
            return (
              <Col lg={4} sm={12} key={index}>
                <Card style={{ marginTop: "10px" }} onClick={() => {}}>
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
                        <Col>Date de fin prévue:</Col>
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
                  </Card.Body>
                </Card>
              </Col>
            );
          }
        })}
      </>
    );
  } else {
    return <GrosTaskList></GrosTaskList>;
  }
}

export default TaskList;
