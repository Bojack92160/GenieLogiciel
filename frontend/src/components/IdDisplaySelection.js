import React from "react" 
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    searchId : {
      
      display: "flex",
      width:"20%",
      margin:"2rem auto"

    }
  });


const IdDisplaySelection = (props) => {
    const classes = useStyles();

    return (
        
            <div className={classes.searchId}>
            <input type="search" id="form1" className="form-control" placeholder="Id"
            aria-label="Search" />
            </div>
        
    )
}

export default IdDisplaySelection