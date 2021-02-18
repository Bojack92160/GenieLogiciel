import React from "react" 
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    groupedFields : {
      justifyContent: 'space-around',
      display: "flex"
    },
    searchField:{

    }
  });


const CollabDisplaySelection = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.groupedFields}>
            <div className={classes.searchField}>
            <input type="search" id="form1" className="form-control" placeholder="Id"
            aria-label="Search" />
            </div>
            <div className={classes.searchField}>
            <input type="search" id="form1" className="form-control" placeholder="nom"
            aria-label="Search" />
            </div>
            <div className={classes.searchField}>
            <input type="search" id="form1" className="form-control" placeholder="prenom"
            aria-label="Search" />
            </div>
            <div className={classes.searchField}>
            <input type="search" id="form1" className="form-control" placeholder="email"
            aria-label="Search" />
            </div>
            
        </div>
    )
}

export default CollabDisplaySelection