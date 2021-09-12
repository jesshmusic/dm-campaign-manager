import {useAccordionButton} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import {FiChevronDown} from 'react-icons/all';
import React from 'react';
import PropTypes from 'prop-types';

const SectionHeading = ({title, eventKey}) => {
  const decoratedOnClick = useAccordionButton(eventKey);

  return (
    <Button variant="link" size="lg" className={ 'mt-3' } block onClick={ decoratedOnClick }>
      <h2>{ title } <FiChevronDown/></h2>
    </Button>
  );
};

SectionHeading.propTypes = {
  eventKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default SectionHeading;