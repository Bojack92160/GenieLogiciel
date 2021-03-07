import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  groupedFields: {
    justifyContent: "space-around",
    display: "flex",
    marginBottom: "2rem",
  },
  searchField: {},
  root: {
    width: "80%",
    margin: "0 auto",
  },
});

const ClientDisplaySelection = (props) => {
  const [state, setState] = useState({
    id: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    role: "",
    users: [],
    user: null,
    loading: true,
  });

  const handleChangeId = (event) => {
    setState({ id: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Client";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { id: event.target.value };
    var raw = JSON.stringify(req);

    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    setState({ loading: true });
    fetch(apiUrl, reqOptions)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.error(res);
        if (res.length > 0) {
          setState({ users: res, loading: false });
        }
      });
  };
  const handleChangeEmail = (event) => {
    setState({ email: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Client";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { email: event.target.value };
    var raw = JSON.stringify(req);

    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    setState({ loading: true });
    fetch(apiUrl, reqOptions)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.error(res);
        if (res.length > 0) {
          setState({ users: res, loading: false });
        }
      });
  };
  const handleChangeEntreprise = (event) => {
    setState({ entreprise: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Client";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { entreprise: event.target.value };
    var raw = JSON.stringify(req);

    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    setState({ loading: true });
    fetch(apiUrl, reqOptions)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.error(res);
        if (res.length > 0) {
          setState({ users: res, loading: false });
        }
      });
  };
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
            placeholder="email"
            aria-label="Search"
            onChange={handleChangeEmail}
          />
        </div>
        <div className={classes.searchField}>
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="entreprise"
            aria-label="Search"
            onChange={handleChangeEntreprise}
          />
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Entreprise</th>
            <th>Email</th>
            <th>Telephone</th>
          </tr>
        </thead>
        {!state.loading ? (
          <tbody>
            {state.users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.nomEntreprise}</td>
                <td>{user.email}</td>
                <th>{user.tel}</th>
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  );
};

export default ClientDisplaySelection;
