import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../../utilities/enums';
import { GiArchiveResearch } from 'react-icons/gi';
import Button from '../Button/Button';
import styles from './search-field.module.scss';

const SearchField = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
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
