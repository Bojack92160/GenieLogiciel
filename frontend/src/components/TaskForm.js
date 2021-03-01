import { React, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";

const getNow = () => {
  const now = new Date();
  console.log(now.toLocaleDateString());
  return now.toLocaleDateString();
};
const useStyles = makeStyles((theme) => ({
  liste: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
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
  console.log("-------------add-----------", props);
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
      <h1>Créer une Tâche</h1>
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
          <List className={classes.liste}>
            Prédecesseurs
            {props.project.slice(1).map((item) => {
              const labelId = `checkbox-list-label-${item.titre}`;

              return (
                <ListItem
                  key={item}
                  role={undefined}
                  dense
                  button
                  //onClick={handleToggle(value)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      //checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`${item[1]}`} />
                </ListItem>
              );
            })}
          </List>

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

export default TaskForm;
