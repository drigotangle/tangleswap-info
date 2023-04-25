import { BrowserRouter, Routes, Route } from "react-router-dom"
import { createTheme, ThemeProvider } from '@mui/material';

import Home from './pages/Home'
import Pools from "./pages/Pools";
import PoolPage from './pages/Pools/PoolPage';
import Tokens from "./pages/Tokens";
import TokenPage from "./pages/Tokens/TokenPage";
import { createGlobalStyle } from "styled-components";

function App() {

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Inter, Arial',
      ].join(','),
      body1: {
        color: '#FFFFFF', // white
      },
      body2: {
        color: '#B0B0B0', // light gray
      },
      h1: {
        color: '#FFFFFF', // white
      },
      h2: {
        color: '#FFFFFF', // white
      },
      h3: {
        color: '#FFFFFF', // white
      },
      h4: {
        color: '#FFFFFF', // white
        fontSize: '24px'
      },
      h5: {
        color: '#FFFFFF', // white
        fontSize: '18px'
      },
      h6: {
        color: '#FFFFFF', // white
      },
    },
    palette: {
      mode: 'dark',
      background: {
        paper: '#2C2F3D', // dark gray
        default: '#191B1F', // darkest gray
      },
      primary: {
        main: '#9C27B0', // purple
        light: '#C459CF', // lighter purple
        dark: '#6E1B8C', // darker purple
        contrastText: '#FFFFFF', // white
      },
      secondary: {
        main: '#7022E7', // lighter purple
        light: '#9D52F2', // lightest purple
        dark: '#4C00B7', // dark purple
        contrastText: '#FFFFFF', // white
      },
      success: {
        main: '#1B7A43',
        dark: '#12512F',
        contrastText: '#FFFFFF',
        light: '#4CAF50'
      }
    },
  });

  const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #191B1F;
    background: linear-gradient(180deg, rgba(25,27,31,1) 0%, rgba(25,27,31,1) 10%, rgba(118,14,181,0.4962359943977591) 100%);
    color: white;
  }
`;

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:chain/Pools/" element={<Pools />} />
            <Route path="/:chain/Pools/:poolAddress" element={<PoolPage />} />
            <Route path="/:chain/Tokens" element={<Tokens />} />
            <Route path="/:chain/Tokens/:tokenAddress" element={<TokenPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App;
