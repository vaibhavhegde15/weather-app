import React, { useState, useCallback } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import debounce from 'lodash.debounce';

const CitySearchAdd = ({onSelected}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getCities?q=${query}`);
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  const handleInputChange = (event, value) => {
    setInputValue(value);
    if (value.trim()) {
      debouncedFetchSuggestions(value);
    } else {
      setOptions([]);
    }
  };

  return (
    <Autocomplete
      options={options}
      loading={loading}
      onInputChange={handleInputChange}
      onChange={(e,v)=>onSelected(v)}
      inputValue={inputValue}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default CitySearchAdd;
