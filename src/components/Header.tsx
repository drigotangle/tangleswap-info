import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppContext } from '../state';
import ChainMenu from './ChainMenu';
import { AppBar, Toolbar, Typography, Link, Box } from '@mui/material';

const Header = () => {
  const { state } = useContext(AppContext);
  const { chain } = state;

  return (
    <AppBar position="static">
      <Toolbar>
        <Link component={RouterLink} to="/" color="inherit" underline="none">
          <img width={30} src="https://d3m3d54t409w7t.cloudfront.net/logos/Logo_White_Alpha.gif" alt="Logo" />
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;

