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
//Responsable et client

const TaskDisplaySelection = (props) => {
  const [state, setState] = useState({
    id: "",
    titre: "",
    responsable: "",
    collaborateur: "",
    date: "",
    tasks: [],
    task: null,
  });

  const handleChangeId = (event) => {
    setState({ id: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Tache";
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
          setState({ tasks: res, loading: false });
        }
      });
  };
  const handleChangeTitle = (event) => {
    setState({ titre: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Tache";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { titre: event.target.value };
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
          setState({ tasks: res, loading: false });
        }
      });
  };
  const handleChangeDate = (event) => {
    setState({ date: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Tache";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { date: event.target.value };
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
          setState({ tasks: res, loading: false });
        }
      });
  };
  const handleChangeResponsable = (event) => {
    setState({ responsable: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Tache";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { responsable: event.target.value };
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
          setState({ tasks: res, loading: false });
        }
      });
  };
  const handleChangeCollab = (event) => {
    setState({ collaborateur: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Tache";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { collaborateur: event.target.value };
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
          setState({ tasks: res, loading: false });
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
            value={state.id}
            onChange={handleChangeId}
          />
        </div>
        <div className={classes.searchField}>
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="titre"
            aria-label="Search"
            value={state.titre}
            onChange={handleChangeTitle}
          />
        </div>
        <div className={classes.searchField}>
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="date"
            aria-label="Search"
            onChange={handleChangeDate}
          />
        </div>
        <div className={classes.searchField}>
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="responsable"
            aria-label="Search"
            onChange={handleChangeResponsable}
          />
        </div>
        <div className={classes.searchField}>
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="collaborateur"
            aria-label="Search"
            onChange={handleChangeCollab}
          />
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Titre</th>
            <th>Date</th>
            <th>Responsable</th>
            <th>Collaborateur</th>
          </tr>
        </thead>
        {!state.loading ? (
          <tbody>
            {state.tasks.map((task) => (
              <tr key={task._id}>
                <td>{task._id}</td>

                <td>{task.titre}</td>
                <td>
                  {task.dateDebutEffect} -- {task.dateFinEffect}
                </td>
                <td>{task.responsable}</td>
                <td>{task.collaborateur}</td>
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  );
};

export default TaskDisplaySelection;
