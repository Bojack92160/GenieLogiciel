import React from "react" 
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    groupedFields : {
      justifyContent: 'space-around',
      display: "flex"
    }
  });


const ClientDisplaySelection = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.groupedFields}>
            <div className={classes.searchId}>
            <input type="search" id="form1" className="form-control" placeholder="Id"
            aria-label="Search" />
            </div>
            <div className={classes.searchMail}>
            <input type="search" id="form1" className="form-control" placeholder="email"
            aria-label="Search" />
            </div>
            <div className={classes.searchEntreprise}>
            <input type="search" id="form1" className="form-control" placeholder="entreprise"
            aria-label="Search" />
            </div>
            <div className={classes.searchTel}>
            <input type="search" id="form1" className="form-control" placeholder="téléphone"
            aria-label="Search" />
            </div>
        </div>
    )
}

export default ClientDisplaySelection