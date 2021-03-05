import { React, useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";
import Button from "react-bootstrap/Button";
function CrCard(props) {
  console.log(props);
  const [stop, setStop] = useState(false);
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");
  const [desc, setDesc] = useState("");
  const [charge, setCharge] = useState("");
  const [avancement, setavancement] = useState(
    props.task.dataAvancement.pourcent
  );
  const handleBeginChange = (e) => {
    setDebut(e.target.value);
  };
  const handleEndChange = (e) => {
    setFin(e.target.value);
  };
  const handleChargeChange = (e) => {
    setCharge(e.target.value);
  };
  const handleDescChange = (e) => {
    setDesc(e.target.value);
  };
  return (
    <Col sm={12} lg={12} style={{ marginTop: "20px" }}>
      <Card>
        <Card.Body>
          <Card.Title>{props.task.titre}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {props.task.description}
          </Card.Subtitle>
          <br />
          <Row>
            <Col>
              <TextField
                variant="outlined"
                //margin="normal"
                required
                id="date"
                label="Début de la période"
                type="date"
                InputLabelProps={{
                  shrink: true,
                  style: { color: "#060b26" },
                }}
                onChange={handleBeginChange}
              />
            </Col>
            <Col>
              <TextField
                variant="outlined"
                //margin="normal"
                required
                id="date"
                label="Fin de la période"
                type="date"
                InputLabelProps={{
                  shrink: true,
                  style: { color: "#060b26" },
                }}
                onChange={handleEndChange}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col lg={3} sm={3}>
              <TextField
                variant="outlined"
                //margin="normal"
                required
                fullWidth
                id="Charge"
                label="Charge consummée"
                name="Charge"
                autoComplete="Charge"
                autoFocus
                InputLabelProps={{
                  style: { color: "#060b26" },
                }}
                onChange={handleChargeChange}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Slider
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                defaultValue={props.task.dataAvancement.pourcent * 100}
                marks
                steps={0.01}
                onChange={(_, value) => {
                  setavancement(value);
                }}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <TextField
                id="outlined-multiline-static"
                label="Commentaire"
                autoFocus
                multiline
                rows={3}
                variant="outlined"
                InputLabelProps={{
                  style: { color: "#060b26" },
                }}
                onChange={handleDescChange}
              />
            </Col>
            <Col>
              <Button
                onClick={() => {
                  if (!stop) {
                    var reste = 0;
                    if (avancement !== 1) {
                      const pourcent =
                        avancement - props.task.dataAvancement.pourcent * 100;
                      reste = ((100 - pourcent) * charge) / pourcent;
                    } else {
                      reste = 0;
                    }

                    const body = {
                      _idTache: props.task._id,
                      _idUtilisateur: props.user._id,
                      periodeDebut: debut,
                      periodeFin: fin,
                      chargeEffectue: parseInt(charge),
                      chargeRestante: reste,
                      avancementFinal: avancement / 100,
                      commentaire: desc,
                    };

                    const apiUrl =
                      "http://localhost:3001/Ajout/Rapport_Activite";
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    var raw = JSON.stringify(body);
                    console.log(raw);
                    var reqOptions = {
                      method: "POST",
                      headers: myHeaders,
                      body: raw,
                      redirect: "follow",
                    };
                    fetch(apiUrl, reqOptions)
                      .then((res) => res.json())
                      .then((data) => {
                        console.log(data);
                        setStop(true);
                      });
                    //console.log(body);
                  } else {
                    alert("Compte rendu déjà envoyé");
                  }
                }}
              >
                Envoyer le compte rendu de tâche
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default CrCard;
