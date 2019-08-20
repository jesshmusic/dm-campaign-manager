import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles({
  card: {
    borderRadius: 0,
    boxShadow: 'none',
  },
  media: {
    height: 140,
  },
});

const HeroBanner = () => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={'/assets/rays-of-sun-through-trees.jpg'}
        title={'rays of sun through trees'}
      />
    </Card>
  );
};

HeroBanner.propTypes = {
};

export default HeroBanner;
