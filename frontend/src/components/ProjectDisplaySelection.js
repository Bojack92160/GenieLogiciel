import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LensIcon from "@material-ui/icons/Lens";
import moment from "moment";

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
const ProjectDisplaySelection = (props) => {
  const [state, setState] = useState({
    id: "",
    titre: "",
    //responsable:"",

    date: "",
    etat: "",
    projects: [],
    project: null,
    loading: true,
  });

  const handleChangeId = (event) => {
    setState({ id: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Projet";
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
          setState({ projects: res, loading: false });
        }
      });
  };
  const handleChangeTitle = (event) => {
    setState({ titre: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Projet";
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
          setState({ projects: res, loading: false });
        }
      });
  };
  const handleChangeDate = (event) => {
    setState({ date: event.target.value });
    const apiUrl = "http://localhost:3001/Recherche/Projet";
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
          setState({ projects: res, loading: false });
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
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Titre</th>
            <th>Date</th>
            <th>Responsable</th>
            <th>Client</th>
            <th>Etat</th>
          </tr>
        </thead>
        {!state.loading ? (
          <tbody>
            {state.projects.map((project) => (
              <tr key={project._id}>
                <td>{project._id}</td>

                <td>{project.titre}</td>
                <td>
                  {project.dateDebutEffect} -- {project.dateFinEffect}
                </td>
                <td>{project.responsable}</td>
                <td>{project.client}</td>
                <td>
                  <LensIcon
                    color={
                      moment(project.dateFinEffect).format("DD-MM-YYYY H:mm") <
                      moment().format("DD-MM-YYYY H:mm")
                        ? "primary"
                        : "secondary"
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  );
};

export default ProjectDisplaySelection;
