import { React, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

const getNow = () => {
  const now = new Date();
  console.log(now.toLocaleDateString());
  return now.toLocaleDateString();
};
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      //margin: "2rem auto",
      margin: "0.5rem auto",
      width: "75%",
    },
  },
  description: {
    width: "50%",
  },
  groupedFields: {
    justifyContent: "space-around",
    display: "flex",
  },
}));

const ProjectForm = () => {
  const handleEndChange = (e) => {
    setstate({
      titre: state.titre,
      description: state.description,
      responsable: state.responsable,
      client: state.client,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: e.target.value,
    });
  };
  const handleBeginChange = (e) => {
    setstate({
      titre: state.titre,
      description: state.description,
      responsable: state.responsable,
      client: state.client,
      dateDebutInit: e.target.value,
      dateFinInit: state.dateFinInit,
    });
  };
  const handleClientChange = (e) => {
    setstate({
      titre: state.titre,
      description: state.description,
      responsable: state.responsable,
      client: e.target.value,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: state.dateFinInit,
    });
  };
  const handleRespChange = (e) => {
    setstate({
      titre: state.titre,
      description: state.description,
      responsable: e.target.value,
      client: state.client,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: state.dateFinInit,
    });
  };
  const handleDescChange = (e) => {
    setstate({
      titre: state.titre,
      description: e.target.value,
      responsable: state.responsable,
      client: state.client,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: state.dateFinInit,
    });
  };
  const handleTittleChange = (e) => {
    setstate({
      titre: e.target.value,
      description: state.description,
      responsable: state.responsable,
      client: state.client,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: state.dateFinInit,
    });
  };

  const [state, setstate] = useState({
    titre: "",
    description: "",
    responsable: "",
    client: "",
    dateDebutInit: "",
    dateFinInit: "",
    now: new Date(),
  });

  const classes = useStyles();
  const history = useHistory();
  return (
    <>
      <h1>Créer un projet</h1>
      <form className={classes.root} noValidate autoComplete="off">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="titre"
            label="Titre"
            name="titre"
            autoComplete="titre"
            autoFocus
            InputLabelProps={{
              style: { color: "#060b26" },
            }}
            onChange={handleTittleChange}
          />
          <TextField
            id="outlined-multiline-static"
            label="Description"
            required
            autoFocus
            multiline
            rows={3}
            variant="outlined"
            InputLabelProps={{
              style: { color: "#060b26" },
            }}
            onChange={handleDescChange}
          />

          <TextField
            className={classes.description}
            variant="outlined"
            //margin="normal"
            required
            fullWidth
            id="resp"
            label="Responsable"
            name="resp"
            autoComplete="collaborateurs"
            autoFocus
            InputLabelProps={{
              style: { color: "#060b26" },
            }}
            onChange={handleRespChange}
          />

          <TextField
            className={classes.description}
            variant="outlined"
            //margin="normal"
            required
            fullWidth
            id="client"
            label="Client"
            name="client"
            autoComplete="client"
            autoFocus
            InputLabelProps={{
              style: { color: "#060b26" },
            }}
            onChange={handleClientChange}
          />
          <TextField
            className={classes.description}
            variant="outlined"
            //margin="normal"
            required
            id="date"
            label="Date de début"
            type="date"
            InputLabelProps={{
              shrink: true,
              style: { color: "#060b26" },
            }}
            onChange={handleBeginChange}
          />
          <TextField
            className={classes.description}
            variant="outlined"
            //margin="normal"
            required
            id="date"
            label="Date de fin"
            type="date"
            InputLabelProps={{
              shrink: true,
              style: { color: "#060b26" },
            }}
            onChange={handleEndChange}
          />

          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => {
              const apiUrl = "http://localhost:3001/Ajout/Projet";
              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");
              const req = state;
              var raw = JSON.stringify(req);
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
                  if (data.success) {
                    history.goBack();
                  } else {
                    alert(data.erreur);
                  }
                });
            }}
          >
            Créer
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProjectForm;
