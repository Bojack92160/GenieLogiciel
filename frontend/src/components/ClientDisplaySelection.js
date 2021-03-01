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


const ClientDisplaySelection = (props) => {
  const [state, setState] = useState({
    id: "",
    email:"",
    entreprise:""
  });

  const handleChangeId = (event) => {
    setState({id: event.target.value})
    const apiUrl = "http://localhost:3001/Recherche/Client";
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
  const handleChangeEmail = (event) => {
    setState({email: event.target.value})
    const apiUrl = "http://localhost:3001/Recherche/Client";
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
  const handleChangeEntreprise = (event) => {
    setState({entreprise: event.target.value})
    const apiUrl = "http://localhost:3001/Recherche/Client";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const req = { entreprise: state.entreprise };
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
            <input type="search" id="form1" className="form-control" placeholder="email"
            aria-label="Search" onChange={handleChangeEmail}/>
            </div>
            <div className={classes.searchField}>
            <input type="search" id="form1" className="form-control" placeholder="entreprise"
            aria-label="Search" onChange={handleChangeEntreprise} />
            </div>
            
        </div>
    )
}

export default ClientDisplaySelection