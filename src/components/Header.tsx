import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppContext, initialState } from '../state';
import { AppBar, Toolbar, Typography, Link, Box, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { containsTokenAddressInPools, containsTokenAddressInTokens, isValidEthereumAddress } from '../functions/utils';

interface IError {
  error: boolean
  message: string
}

const Header = () => {
  const { state } = useContext(AppContext);
  const { chain } = state;
  const [searchInputValue, setSearchInputValue] = useState<string | undefined>(undefined)
  const [error, setError] = useState<IError>({ error: false, message: '' })
  const [ url, setUrl] = useState<string | undefined>(undefined)
  const navigate = useNavigate();


  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
  };

  useEffect(() => {
    setError({error: false, message:''})
    if (searchInputValue !== undefined && state.tokenData !== initialState.tokenData && state.poolData !== initialState.poolData) {
      if (!isValidEthereumAddress(searchInputValue)) {
        setError({ error: true, message: 'Not a valid Ethereum address' })
      }

      if (!containsTokenAddressInTokens(state.tokenData, searchInputValue) && !containsTokenAddressInPools(state.poolData, searchInputValue) && error.error === false) {
        setError({ error: true, message: 'Not token or pool found' })
      }

      if (containsTokenAddressInTokens(state.tokenData, searchInputValue)) {
        setUrl('token')
      }

      if (containsTokenAddressInPools(state.poolData, searchInputValue)) {
        setUrl('pool')
      }
    }
  }, [searchInputValue])

  return (
    <AppBar position="static">
      <Toolbar>
        <Link component={RouterLink} to="/" color="inherit" underline="none">
          <img width={30} src="https://d3m3d54t409w7t.cloudfront.net/logos/Logo_White_Alpha.webp" alt="Logo" />
        </Link>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: '4vw', ml: 2 }}>
          {['Overview', 'Pools', 'Tokens'].map((data: string, index: number) => {
            const linkPath = index === 0 ? '/' : `/${chain}/${data}`;

            return (
              <Link
                key={data}
                component={RouterLink}
                to={linkPath}
                color="inherit"
                underline="none"
              >
                <Typography variant="h6">{data}</Typography>
              </Link>
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            value={searchInputValue}
            onChange={handleSearchInputChange}
            variant="outlined"
            size="small"
            placeholder="Search"
            error={error.error}
            helperText={error.error ? error.message : ''}
            InputProps={{
              endAdornment: (
                <IconButton 
                disabled={
                  error.error || 
                  !searchInputValue ||
                  !containsTokenAddressInTokens(state.tokenData, searchInputValue) && !containsTokenAddressInPools(state.poolData, searchInputValue)
                } 
                type="submit" 
                aria-label="search" 
                edge="end"
                onClick={() => {
                  navigate(
                    url === 'pool'
                      ? `/${chain}/Pools/${searchInputValue}`
                      : `/${chain}/Tokens/${searchInputValue}`,
                  );
                }}
                >
                  <SearchIcon
                  />
                </IconButton>
              ),
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;


