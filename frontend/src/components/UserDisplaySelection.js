import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: "80%",
    margin: "0 auto",
  },
  cardContent: {
    width: "10%",
    height: "5%",
    minWidth: 275,
  },
  groupedFields: {
    justifyContent: "space-around",
    display: "flex",
    marginBottom: "2rem",
  },

  title: {
    fontSize: 12,
    fontWeight: "bold",
  },
  table: {
    margin: "2rem auto",
    width: "25%",
    height: "20%",
    minWidth: 275,
  },
  pos: {
    marginBottom: 12,
  },
});

const UserDisplaySelection = (props) => {
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
    const apiUrl = "http://localhost:3001/Recherche/Utilisateur";
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

  const handleChangeName = (event) => {
    setState({ nom: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Utilisateur";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { nom: event.target.value };
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
  const handleChangeFirstName = (event) => {
    setState({ prenom: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Utilisateur";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { prenom: event.target.value };
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
    const apiUrl = "http://localhost:3001/Recherche/Utilisateur";
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
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom</th>
            <th>Prenom</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        {!state.loading ? (
          <tbody>
            {state.users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.nom}</td>
                <td>{user.prenom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  );
};
//dhaou: yekhi lezem kol manekel netdhakrek, me3dti enty, barra nikomek, het nech3el l3asba tesh3el s7an petit labyedh w
export default UserDisplaySelection;
