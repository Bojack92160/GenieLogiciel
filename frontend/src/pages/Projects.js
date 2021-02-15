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

const useStyles = makeStyles({
  table: {
    minWidth: "650px",
    paddingTop: "20px"
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


function Projects() {
  const classes = useStyles();

  return (
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
              <TableCell >{row.etat}</TableCell>
              
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default withStyles(useStyles)(Projects);






