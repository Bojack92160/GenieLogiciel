import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      //margin: "2rem auto",
      margin:"0.5rem auto",
      width: '75%',
    },
  },
  description:{
      width:"50%"
  },
  groupedFields : {
    justifyContent: 'space-around',
    display: "flex"
  }
}));


const ProjectForm = () => {
    const classes = useStyles();
    return ( 
    <>
    {/* <h1>Créer un projet/tâche</h1> */}
    <form className={classes.root} noValidate autoComplete="off">
        <div>
        <TextField
            variant="outlined"
            style={{
                position: 'absolute', left: '50%', top: '18%',width: 500,
                
                display: 'flex',
                transform: 'translate(-50%, -50%)'
            }}
            margin="normal"
            required
            fullWidth
            id="titre"
            label="Titre"
            name="titre"
            autoComplete="titre"
            autoFocus
          />
          <TextField
          id="outlined-multiline-static"
          label="Description"
          required
          autoFocus
          style={{
            position: 'absolute', left: '50%', top: '32%',width: 500,
            
            display: 'flex',
            transform: 'translate(-50%, -50%)'
        }}
          multiline
          rows={3}
          
          variant="outlined"
        />
          {/* <TextField className={classes.description}
            variant="outlined"
            
            //margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            autoComplete="description"
            autoFocus
          /> */}
          <TextField className={classes.description}
            variant="outlined"
            style={{
                position: 'absolute', left: '50%', top: '45.5%',width: 500,
                
                display: 'flex',
                transform: 'translate(-50%, -50%)'
            }}
            //margin="normal"
            required
            fullWidth
            id="collaborateurs"
            label="Collaborateurs"
            name="collaborateurs"
            autoComplete="collaborateurs"
            autoFocus
          />
          
          <TextField className={classes.description}
            variant="outlined"
            style={{
                position: 'absolute', left: '50%', top: '55.5%',width: 500,
                
                display: 'flex',
                transform: 'translate(-50%, -50%)'
            }}
            //margin="normal"
            required
            fullWidth
            id="clients"
            label="Clients"
            name="clients"
            autoComplete="clients"
            autoFocus
          />
          <TextField className={classes.description}
            variant="outlined"
            style={{
                position: 'absolute', left: '50%', top: '65.5%',width: 500,
                
                display: 'flex',
                transform: 'translate(-50%, -50%)'
            }}
            //margin="normal"
            required
            fullWidth
            id="dates"
            label="Dates"
            name="dates"
            autoComplete="dates"
            autoFocus
          />
          <TextField className={classes.description}
            variant="outlined"
            style={{
                position: 'absolute', left: '50%', top: '75.5%',width: 500,
                
                display: 'flex',
                transform: 'translate(-50%, -50%)'
            }}
            //margin="normal"
            required
            fullWidth
            id="charge"
            label="Charge"
            name="charge"
            autoComplete="charge"
            autoFocus
          />
          <TextField className={classes.description}
            variant="outlined"
            style={{
                position: 'absolute', left: '50%', top: '85.5%',width: 500,
                
                display: 'flex',
                transform: 'translate(-50%, -50%)'
            }}
            //margin="normal"
            required
            fullWidth
            id="prédecesseurs"
            label="Prédecesseurs"
            name="prédecesseurs"
            autoComplete="prédecesseurs"
            autoFocus
          />
            <Button style={{
                position: 'absolute', left: '95%', top: '95%',
                
                display: 'flex',
                transform: 'translate(-50%, -50%)'
            }} variant="contained" color="primary" disableElevation>
              Créer 
            </Button>
          </div>
          
        
    </form>
    
        
      </>  );
       
}
 
export default ProjectForm;