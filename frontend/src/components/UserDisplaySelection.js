import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SimpleCard from "./Informations";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  groupedFields: {
    justifyContent: "space-around",
    display: "flex",
  },
  searchField: {},
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  pos: {
    marginBottom: 12,
  },
});

const UserDisplaySelection = (props) => {
  const [state, setState] = useState({
    nom: "",
    prenom: "",
    email: "",
    entreprise: "",
    user: null,
  });

  const handleChangeId = (event) => {
    setState({ id: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Utilisateur";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { id: state.id };
    var raw = JSON.stringify(req);
    console.log(req);
    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch(apiUrl, reqOptions)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.error(res);
        if (res.length === 1) {
          setState({ user: res[0] });
        }
      });
  };

  const handleChangeName = (event) => {
    setState({ nom: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Utilisateur";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { nom: state.nom };
    var raw = JSON.stringify(req);
    console.log(req);
    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch(apiUrl, reqOptions)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.error(res);
        if (res.length === 1) {
          setState({ user: res[0] });
        }
      });
  };
  const handleChangeFirstName = (event) => {
    setState({ prenom: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Utilisateur";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { prenom: state.prenom };
    var raw = JSON.stringify(req);
    console.log(req);
    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch(apiUrl, reqOptions)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.error(res);
        if (res.length === 1) {
          setState({ user: res[0] });
        }
      });
  };

  const handleChangeEmail = (event) => {
    setState({ email: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Utilisateur";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { email: state.email };
    var raw = JSON.stringify(req);
    console.log(req);
    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch(apiUrl, reqOptions)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.error(res);
        if (res.length === 1) {
          setState({ user: res[0] });
        }
      });
  };
  const classes = useStyles();

  return (
    <div>
      <div className={classes.groupedFields}>
        <div className={classes.searchField}>
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="Id"
            aria-label="Search"
            onChange={handleChangeId}
          />
        </div>
        <div className={classes.searchField}>
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="nom"
            aria-label="Search"
            onChange={handleChangeName}
          />
        </div>
        <div className={classes.searchField}>
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="prenom"
            aria-label="Search"
            onChange={handleChangeFirstName}
          />
        </div>
        <div className={classes.searchField}>
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="email"
            aria-label="Search"
            onChange={handleChangeEmail}
          />
        </div>
      </div>
      {state.user != null ? (
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} gutterBottom>
              prenom:
            </Typography>
            {state.user.prenom}
            <Typography className={classes.title}>nom:</Typography>
            {state.user.nom}
            <Typography className={classes.title}>email:</Typography>
            {state.user.email}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default UserDisplaySelection;
