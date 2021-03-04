import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  searchId: {
    display: "flex",
    width: "20%",
    margin: "2rem auto",
  },
});

const IdDisplaySelection = (props) => {
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
    console.log(req);
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
    <div>
      <div className={classes.searchId}>
        <input
          type="search"
          id="form1"
          className="form-control"
          placeholder="Id"
          aria-label="Search"
          onChange={handleChangeId}
        />
      </div>{" "}
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

export default IdDisplaySelection;
