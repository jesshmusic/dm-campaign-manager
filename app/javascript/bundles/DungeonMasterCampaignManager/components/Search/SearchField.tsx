import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../../utilities/enums';
import { GiArchiveResearch } from 'react-icons/all';
import Button from '../Button/Button';
const styles = require('./search-field.module.scss');

const SearchField = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    navigate(`/app/search/${data.search}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.searchBar}>
      <div className={styles.inputGroup}>
        <input id="searchBarMain" {...register('search')} placeholder={'Search...'} />
        <Button
          className={styles.searchButton}
          color={Colors.secondary}
          title="Search"
          type="submit"
          icon={<GiArchiveResearch />}
        />
      </div>
    </form>
  );
};

export default SearchField;
