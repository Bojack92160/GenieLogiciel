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


const UserDisplaySelection = (props) => {
  const [state, setState] = useState({
    id: "",
    nom:"",
    prenom:"",
    email:""
  });

  const handleChangeId = (event) => {
    setState({id: event.target.value})
    const apiUrl = "http://localhost:3001/Recherche/Utilisateur";
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
  const handleChangeName = (event) => {
    setState({nom: event.target.value})
    const apiUrl = "http://localhost:3001/Recherche/Utilisateur";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { nom: state.nom };
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
  const handleChangeFirstName = (event) => {
    setState({prenom: event.target.value})
    const apiUrl = "http://localhost:3001/Recherche/Utilisateur";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { prenom: state.prenom };
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

  const handleChangeEmail = (event) => {
    setState({email: event.target.value})
    const apiUrl = "http://localhost:3001/Recherche/Utilisateur";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { email: state.email };
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
            aria-label="Search" onChange={handleChangeId}/>
            </div>
            <div className={classes.searchField}>
            <input type="search" id="form1" className="form-control" placeholder="nom"
            aria-label="Search" onChange={handleChangeName} />
            </div>
            <div className={classes.searchField}>
            <input type="search" id="form1" className="form-control" placeholder="prenom"
            aria-label="Search" onChange={handleChangeFirstName}/>
            </div>
            <div className={classes.searchField}>
            <input type="search" id="form1" className="form-control" placeholder="email"
            aria-label="Search" onChange={handleChangeEmail}/>
            </div>
            
        </div>
    )
}

export default UserDisplaySelection