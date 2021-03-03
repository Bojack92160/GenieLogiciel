import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Explore from "./pages/Explore";
import Notifs from "./pages/Notifs";
import Settings from "./pages/Settings";
import { td } from "./components/TasksData";
import loading from "./components/Loading";

import LoginForm from "./components/loginForm";
import SignUp from "./components/SignUp";
import ProjectForm from "./components/ProjectForm";
import {
  Button,
  CssBaseline,
  Checkbox,
  TextField,
  FormControlLabel,
  Link,
  Grid,
  Box,
  Typography,
  makeStyles,
  Container,
} from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
function App() {
  const classes = useStyles();
  const HomeLoading = loading(Home);
  const [appState, setAppState] = useState({
    loading: false,
    userData: null,
    notifsData: null,
    projectsData: null,
    tasksData: null,
    islogged: false,
    email: "",
    mdp: "",
  });
  const handleMailChange = (e) => {
    //console.log(e);
    setAppState({ mdp: appState.mdp, email: e.target.value });
    console.log(appState.email);
  };
  const handleMDPChange = (e) => {
    setAppState({ mdp: e.target.value, email: appState.email });
    console.log(appState.mdp);
  };

  const login = () => {
    setAppState({ loading: true });
    const apiUrl = "http://localhost:3001/login";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const user = { email: appState.email, mdp: appState.mdp };
    var raw = JSON.stringify(user);
    console.log(user);
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
        if (data) {
          console.log("bonnerep");
          setAppState({
            loading: false,
            userData: data.dataUtilisateur,
            notifsData: data.dataNotifications,
            projectsData: data.dataProjects,
            tasksData: data.dataTaches,
            isLoading: true,
            islogged: true,
          });
        } else {
          window.alert("Mauvais identifiants");
        }
      })
      .catch((error) => console.log("error", error));
  };
  /* useEffect(() => {
    setAppState({ loading: true });
    const apiUrl = "http://localhost:3001/login";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(user);

    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(apiUrl, reqOptions)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setAppState({
          loading: false,
          userData: data.dataUtilisateur,
          notifsData: data.dataNotifications,
          projectsData: data.dataProjects,
          tasksData: data.dataTaches,
        });
      })
      .catch((error) => console.log("error", error));
  }, [setAppState]); */
  if (!appState.islogged) {
    return (
      <React.Fragment>
        <main className="App">
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleMailChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleMDPChange}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    login();
                  }}
                >
                  Sign In
                </Button>
              </form>
            </div>
            <Box mt={8}>
              <Typography variant="body2" color="textSecondary" align="center">
                {"Copyright © "}
                <Link color="inherit" href="https://material-ui.com/">
                  Project Manager
                </Link>{" "}
                {new Date().getFullYear()}
                {"."}
              </Typography>
            </Box>
          </Container>
        </main>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <main className="App">
          <Router>
            <Sidebar />
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <HomeLoading
                    isLoading={appState.loading}
                    Userdata={appState.userData}
                    tasks={appState.tasksData}
                  />
                )}
              />
              <Route
                path="/projects"
                render={() => (
                  <Projects
                    Userdata={appState.userData}
                    projects={appState.projectsData}
                  />
                )}
              />
              <Route
                path="/notifications"
                render={() => <Notifs notifs={appState.notifsData} />}
              />
              <Route path="/explore" component={Explore} />
              <Route path="/settings" component={ProjectForm} />
              <Route exact path="/login" component={LoginForm} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/signup" component={SignUp} />
            </Switch>
          </Router>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
