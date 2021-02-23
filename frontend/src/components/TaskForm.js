import { React, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

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

const TaskForm = (props) => {
  const handleEndChange = (e) => {
    setstate({
      titre: state.titre,
      description: state.description,
      responsable: state.responsable,
      Collaborateur: state.Collaborateur,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: e.target.value,
    });
  };
  const handleBeginChange = (e) => {
    setstate({
      titre: state.titre,
      description: state.description,
      responsable: state.responsable,
      Collaborateur: state.Collaborateur,
      dateDebutInit: e.target.value,
      dateFinInit: state.dateFinInit,
    });
  };
  const handleClientChange = (e) => {
    setstate({
      titre: state.titre,
      description: state.description,
      responsable: state.responsable,
      Collaborateur: e.target.value,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: state.dateFinInit,
    });
  };
  const handleRespChange = (e) => {
    setstate({
      titre: state.titre,
      description: state.description,
      responsable: e.target.value,
      Collaborateur: state.Collaborateur,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: state.dateFinInit,
    });
  };
  const handleDescChange = (e) => {
    setstate({
      titre: state.titre,
      description: e.target.value,
      responsable: state.responsable,
      Collaborateur: state.Collaborateur,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: state.dateFinInit,
    });
  };
  const handleTittleChange = (e) => {
    setstate({
      titre: e.target.value,
      description: state.description,
      responsable: state.responsable,
      Collaborateur: state.Collaborateur,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: state.dateFinInit,
    });
  };

  const [state, setstate] = useState({
    titre: "",
    description: "",
    responsable: "",
    Collaborateur: "",
    dateDebutInit: "",
    dateFinInit: "",
    now: new Date(),
  });

  const classes = useStyles();
  const history = useHistory();
  return (
    <>
      {/* <h1>Créer un projet/tâche</h1> */}
      <form className={classes.root} noValidate autoComplete="off">
        <div>
          <TextField
            variant="outlined"
            style={{
              position: "absolute",
              left: "50%",
              top: "18%",
              width: 500,

              display: "flex",
              transform: "translate(-50%, -50%)",
            }}
            margin="normal"
            required
            fullWidth
            id="titre"
            label="Titre"
            name="titre"
            autoComplete="titre"
            autoFocus
            onChange={handleTittleChange}
          />
          <TextField
            id="outlined-multiline-static"
            label="Description"
            required
            autoFocus
            style={{
              position: "absolute",
              left: "50%",
              top: "32%",
              width: 500,

              display: "flex",
              transform: "translate(-50%, -50%)",
            }}
            multiline
            rows={3}
            variant="outlined"
            onChange={handleDescChange}
          />

          <TextField
            className={classes.description}
            variant="outlined"
            style={{
              position: "absolute",
              left: "50%",
              top: "45.5%",
              width: 500,

              display: "flex",
              transform: "translate(-50%, -50%)",
            }}
            //margin="normal"
            required
            fullWidth
            id="resp"
            label="Responsable"
            name="resp"
            autoComplete="collaborateurs"
            autoFocus
            onChange={handleRespChange}
          />

          <TextField
            className={classes.description}
            variant="outlined"
            style={{
              position: "absolute",
              left: "50%",
              top: "55.5%",
              width: 500,

              display: "flex",
              transform: "translate(-50%, -50%)",
            }}
            //margin="normal"
            required
            fullWidth
            id="Collaborateur"
            label="Collaborateur"
            name="Collaborateur"
            autoComplete="Collaborateur"
            autoFocus
            onChange={handleClientChange}
          />
          <TextField
            className={classes.description}
            variant="outlined"
            style={{
              position: "absolute",
              left: "50%",
              top: "66.5%",
              width: 500,

              display: "flex",
              transform: "translate(-50%, -50%)",
            }}
            //margin="normal"
            required
            id="date"
            label="Date de début"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleBeginChange}
          />
          <TextField
            className={classes.description}
            variant="outlined"
            style={{
              position: "absolute",
              left: "50%",
              top: "77.5%",
              width: 500,

              display: "flex",
              transform: "translate(-50%, -50%)",
            }}
            //margin="normal"
            required
            id="date"
            label="Date de fin"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleEndChange}
          />

          <Button
            style={{
              position: "absolute",
              left: "95%",
              top: "95%",

              display: "flex",
              transform: "translate(-50%, -50%)",
              zIndex: 3,
            }}
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

export default TaskForm;
