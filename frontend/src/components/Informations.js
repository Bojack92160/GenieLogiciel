import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard({firstName,lastName,email,entreprise}) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title}  gutterBottom>
          nom:{firstName}
        </Typography>   
        <Typography className={classes.title} >
          prenom:{lastName}
        </Typography>
        <Typography className={classes.title} >
          email:{email}
        </Typography>
        <Typography className={classes.title}>
          entreprise:{entreprise}
        </Typography>
      </CardContent>
      
    </Card>
  );
}
