import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import LensRoundedIcon from '@material-ui/icons/LensRounded';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    height: 48,
    margin: "auto",
    width: "80%"
    // padding: '0 10000px',
  },
  button: {
    position: "fixed",
    bottom: 20,
    right: 20
    // padding: '0 10000px',
  },
});

function createData(titre, periode, etat) {
  return { titre, periode, etat };
}

const rows = [
  createData('Projet A', '11-01-2021--05-03-2021', 'b'),
  createData('Projet B', '11-01-2021--05-03-2021', 'v'),
  createData('Projet C', '11-01-2021--05-03-2021', 'b'),
  createData('Projet D', '11-01-2021--05-03-2021', 'b'),
  createData('Projet E', '11-01-2021--05-03-2021', 'v'),
  
];
Projects.propTypes = {
  classes: PropTypes.object.isRequired,
};

function Projects() {
  const classes = useStyles();

  return (
    <div>
       <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Titre</TableCell>
            <TableCell >Période</TableCell>
            <TableCell >Etat</TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.titre}>
              <TableCell component="th" scope="row">
                {row.titre}
              </TableCell>
              <TableCell >{row.periode}</TableCell>
              <TableCell ><LensRoundedIcon style={row.etat=='b' ? {color:"blue"} : row.etat=='v' ? {color:"red"} : null}/></TableCell>
              
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </TableContainer>
    <Button variant="contained" className={classes.button}>+</Button>
    </div>
   
  );
}

export default withStyles(useStyles)(Projects);






