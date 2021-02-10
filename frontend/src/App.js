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
const user = { email: "Admin@gmail.com", mdp: "Admin" };
function App() {
  const HomeLoading = loading(Home);
  const [appState, setAppState] = useState({
    loading: true,
    user: null,
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
    //test
    console.log(reqOptions);
    fetch(apiUrl, reqOptions)
      .then((res) => res.json())
      .then((res) => console.log(res))
      .then((repos) => {
        setAppState({ loading: false, repos: repos });
      });
    console.log(appState.repos);
  }, [setAppState]);
  return (
    <div className="App">
      <Router>
        <Sidebar />
        <Switch>
          <Route
            path="/"
            render={() => (
              <HomeLoading isLoading={appState.loading} data={td} />
            )}
          />
          <Route path="/projects" component={Projects} />
          <Route path="/notifications" component={Notifs} />
          <Route path="/explore" component={Explore} />
          <Route path="/settings" component={Settings} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
