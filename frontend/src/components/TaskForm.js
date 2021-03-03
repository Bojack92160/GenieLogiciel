import { React, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import Grid from "@material-ui/core/Grid";

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
  const [state, setstate] = useState({
    titre: "",
    description: "",
    responsable: props.projectInfo.responsable,
    client: props.projectInfo.client,
    collaborateur: "",
    dateDebutInit: "",
    dateFinInit: "",
    now: new Date(),
    value: "",
    predecesseurs: [],
    _idMere: props.projectInfo._id,
  });

  console.log("-------------add-----------", state);
  const handleCheck = (event) => {
    console.log(event.target.value);
    var res = state.predecesseurs;
    if (state.predecesseurs.length !== 0) {
      if (state.predecesseurs.find((elem) => elem === event.target.value)) {
        console.log("ok");
        res = res.filter((item) => item !== event.target.value);
      } else {
        console.log("nope");
        res.push(event.target.value);
      }
    } else {
      res = [event.target.value];
    }
    setstate({
      titre: state.titre,
      description: state.description,
      responsable: state.responsable,
      client: state.client,
      collaborateur: state.collaborateur,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: state.dateFinInit,
      _idMere: state._idMere,
      predecesseurs: res,
    });
  };
  const handleChange = (event) => {
    setstate({
      titre: state.titre,
      description: state.description,
      responsable: state.responsable,
      client: state.client,
      collaborateur: state.collaborateur,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: state.dateFinInit,
      _idMere: event.target.value,
      predecesseurs: state.predecesseurs,
    });
  };
  const handleEndChange = (e) => {
    const deb = new Date(state.dateDebutInit);
    const fin = new Date(state.dateFinInit);
    const diffTime = Math.abs(fin - deb);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setstate({
      titre: state.titre,
      description: state.description,
      responsable: state.responsable,
      client: state.client,
      collaborateur: state.collaborateur,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: e.target.value,
      _idMere: state._idMere,
      predecesseurs: state.predecesseurs,
    });
  };
  const handleBeginChange = (e) => {
    const deb = new Date(state.dateDebutInit);
    const fin = new Date(state.dateFinInit);
    const diffTime = Math.abs(fin - deb);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setstate({
      titre: state.titre,
      description: state.description,
      responsable: state.responsable,
      client: state.client,
      collaborateur: state.collaborateur,
      dateDebutInit: e.target.value,
      dateFinInit: state.dateFinInit,
      _idMere: state._idMere,
      predecesseurs: state.predecesseurs,
    });
  };
  const handleColabChange = (e) => {
    setstate({
      titre: state.titre,
      description: state.description,
      responsable: state.responsable,
      client: state.client,
      collaborateur: e.target.value,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: state.dateFinInit,
      _idMere: state._idMere,
      predecesseurs: state.predecesseurs,
    });
  };

  const handleDescChange = (e) => {
    setstate({
      titre: state.titre,
      description: e.target.value,
      responsable: state.responsable,
      client: state.client,
      collaborateur: state.collaborateur,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: state.dateFinInit,
      _idMere: state._idMere,
      predecesseurs: state.predecesseurs,
    });
  };
  const handleTittleChange = (e) => {
    setstate({
      titre: e.target.value,
      description: state.description,
      responsable: state.responsable,
      client: state.client,
      collaborateur: state.collaborateur,
      dateDebutInit: state.dateDebutInit,
      dateFinInit: state.dateFinInit,
      _idMere: state._idMere,
      predecesseurs: state.predecesseurs,
    });
  };

  const classes = useStyles();
  const history = useHistory();
  return (
    <>
      <h1>Créer une Tâche</h1>
      <form className={classes.root} noValidate autoComplete="off">
        <Grid container spacing={1}>
          <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="collaborateur"
              label="Collaborateur"
              name="Collaborateur"
              autoComplete="collaborateur"
              autoFocus
              InputLabelProps={{
                style: { color: "#060b26" },
              }}
              onChange={handleColabChange}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <List className={classes.liste}>
              Prédecesseurs
              {props.project.slice(1).map((item) => {
                const labelId = `checkbox-list-label-${item[1]}`;

                return (
                  <ListItem key={item[0]} role={undefined} dense button>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        value={item[0]}
                        tabIndex={-1}
                        onChange={handleCheck}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${item[1]}`} />
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Tâche mère</FormLabel>
              <RadioGroup
                aria-label="Tâche mère"
                name="Tache mère"
                value={state._idMere}
                onChange={(e) => handleChange(e)}
              >
                {props.project.slice(1).map((item) => {
                  return (
                    <FormControlLabel
                      value={item[0]}
                      control={<Radio />}
                      label={item[1]}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

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
          style={{ position: "fixed", bottom: 12, right: 20, zIndex: 1 }}
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => {
            setstate({
              titre: state.titre,
              description: state.description,
              responsable: state.responsable,
              client: state.client,
              collaborateur: state.collaborateur,
              dateDebutInit: state.dateDebutInit,
              dateFinInit: state.dateFinInit,
              _idMere: state._idMere,
              predecesseurs: state.predecesseurs,
            });
            const apiUrl = "http://localhost:3001/Ajout/Tache";
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
      </form>
    </>
  );
};

export default TaskForm;
