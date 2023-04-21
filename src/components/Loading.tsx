import React from 'react';
import { CircularProgress } from '@mui/material';
import styled from 'styled-components';

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Loading = () => (
  <LoadingWrapper>
    <CircularProgress />
  </LoadingWrapper>
);

export default Loading;