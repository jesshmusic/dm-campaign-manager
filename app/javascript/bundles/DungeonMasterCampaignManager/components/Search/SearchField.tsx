import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../../utilities/enums';
import { GiArchiveResearch } from 'react-icons/gi';
import Button from '../Button/Button';

import { SearchBar, InputGroup, SearchButton } from './SearchField.styles';

const SearchField = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    navigate(`/app/search/${data.search}`);
  };

  return (
    <SearchBar onSubmit={handleSubmit(onSubmit)}>
      <InputGroup>
        <input id="searchBarMain" {...register('search')} placeholder={'Search...'} />
        <SearchButton>
          <Button
            color={Colors.secondary}
            title="Search"
            type="submit"
            icon={<GiArchiveResearch />}
          />
        </SearchButton>
      </InputGroup>
    </SearchBar>
  );
};

export default SearchField;
