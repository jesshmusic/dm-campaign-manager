import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../../utilities/enums';
import { GiArchiveResearch } from 'react-icons/gi';
import Button from '../Button/Button';
import { useSidebar } from '../../contexts/SidebarContext';

import { SearchBar, InputGroup } from './SearchField.styles';

const SearchField = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { sidebarWidth } = useSidebar();
  const onSubmit = (data: { search?: string }) => {
    navigate(`/app/search/${data.search}`);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    void handleSubmit(onSubmit)(e);
  };

  return (
    <SearchBar $sidebarWidth={sidebarWidth} onSubmit={handleFormSubmit}>
      <InputGroup>
        <input id="searchBarMain" {...register('search')} placeholder={'Search...'} />
        <Button
          color={Colors.secondary}
          title="Search"
          type="submit"
          icon={<GiArchiveResearch />}
        />
      </InputGroup>
    </SearchBar>
  );
};

export default SearchField;
