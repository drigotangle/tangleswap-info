import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AppContext } from '../state';
import { useContext, useEffect } from 'react';
import { setChain } from '../state/Actions';

export default function ChainMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { state, dispatch } = useContext(AppContext)
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  }
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {state.chain}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {['Ethereum', 'Shimmer'].map((data) => {
          return (<>
            <MenuItem value='data' onClick={_ => {
              setChain(dispatch, data)
            }}>{data}</MenuItem>
          </>)
        })}
      </Menu>
    </div>
  );
}