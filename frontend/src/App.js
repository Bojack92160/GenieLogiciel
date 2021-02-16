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
const user = { email: "Admin@gmail.com", mdp: "Admin" };
function App() {
  const HomeLoading = loading(Home);
  const [appState, setAppState] = useState({
    loading: false,
    userData: null,
    notifsData: null,
    projectsData: null,
    tasksData: null,
  });
  useEffect(() => {
    setAppState({ loading: true });
    const apiUrl = "https://api.bojack.vercel.app/login";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(user);

    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      mode: "cors",
      body: raw,
      redirect: "follow",
    };
    fetch(apiUrl, reqOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAppState({
          loading: false,
          userData: data.dataUtilisateur,
          notifsData: data.dataNotifications,
          projectsData: data.dataProjects,
          tasksData: data.dataTaches,
        });
      })
      .catch((error) => console.log("error", error));
  }, [setAppState]);
  return (
    <React.Fragment>
      <main className="App">
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              exact
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
            <Route path="/notifications" component={Notifs} />
            <Route path="/explore" component={Explore} />
            <Route path="/settings" component={Settings} />
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/signup" component={SignUp} />
            <div>
              <Sidebar />
              <Route exact path="/projects" component={Projects} />
              <Route exact path="/notifications" component={Notifs} />
              <Route exact path="/explore" component={Explore} />
              <Route exact path="/settings" component={Settings} />
            </div>
          </Switch>
        </Router>
      </main>
    </React.Fragment>
  );
}

export default App;
