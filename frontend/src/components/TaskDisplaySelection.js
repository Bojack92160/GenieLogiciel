import {React,useState} from "react" 
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    groupedFields : {
      justifyContent: 'space-around',
      display: "flex"
    },
    searchField:{
        
    }
  });


const TaskDisplaySelection = (props) => {
  const [state, setState] = useState({
    id: "",
    titre:"",
    responsable:"",
    collaborateur:"",
    date:""


  });

  const handleChangeId = (event) => {
    setState({id: event.target.value})
    const apiUrl = "http://localhost:3001/Recherche/Tache";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { id: state.id };
    var raw = JSON.stringify(req);
    console.log(req);
    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };
    fetch(apiUrl, reqOptions)
    .then((res) => console.log(res))
  }
  const handleChangeTitle = (event) => {
    setState({titre: event.target.value})
    const apiUrl = "http://localhost:3001/Recherche/Tache";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { titre: state.titre };
    var raw = JSON.stringify(req);
    console.log(req);
    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };
    fetch(apiUrl, reqOptions)
    .then((res) => console.log(res))
  }
  const handleChangeResponsable = (event) => {
    setState({responsable: event.target.value})
    const apiUrl = "http://localhost:3001/Recherche/Tache";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { responsable: state.responsable };
    var raw = JSON.stringify(req);
    console.log(req);
    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };
    fetch(apiUrl, reqOptions)
    .then((res) => console.log(res))
  }
  const handleChangeCollab = (event) => {
    setState({collaborateur: event.target.value})
    const apiUrl = "http://localhost:3001/Recherche/Tache";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { collaborateur: state.collaborateur };
    var raw = JSON.stringify(req);
    console.log(req);
    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };
    fetch(apiUrl, reqOptions)
    .then((res) => console.log(res))
  }
  const handleChangeDate = (event) => {
    setState({date: event.target.value})
    const apiUrl = "http://localhost:3001/Recherche/Tache";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { date: state.date };
    var raw = JSON.stringify(req);
    console.log(req);
    var reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };
    fetch(apiUrl, reqOptions)
    .then((res) => console.log(res))
  }
    const classes = useStyles();

    return (
        <div className={classes.groupedFields}>
            <div className={classes.searchField}>
            <input type="search" id="form1" className="form-control" placeholder="Id"
            aria-label="Search" onChange={handleChangeId} />
            </div>
            <div className={classes.searchField}>
            <input type="search" id="form1" className="form-control" placeholder="titre"
            aria-label="Search" onChange={handleChangeTitle} />
            </div>
            <div className={classes.searchField}>
            <input type="search" id="form1" className="form-control" placeholder="date"
            aria-label="Search" onChange={handleChangeResponsable}/>
            </div>
            <div className={classes.searchField}>
            <input type="search" id="form1" className="form-control" placeholder="date"
            aria-label="Search"onChange={handleChangeCollab} />
            </div>
            <div className={classes.searchField}>
            <input type="search" id="form1" className="form-control" placeholder="date"
            aria-label="Search" onChange={handleChangeDate}/>
            </div>
            
        </div>
    )
}

export default TaskDisplaySelection