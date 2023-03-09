import { BrowserRouter, Routes, Route } from "react-router-dom"
import { createTheme, ThemeProvider  } from '@mui/material';

import Home from './pages/Home'
import GlobalStyle from "./style";
import Pools from "./pages/Pools";
import PoolPage from './pages/Pools/PoolPage';
import Tokens from "./pages/Tokens";

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
      },
      h5: {
        color: '#FFFFFF', // white
      },
      h6: {
        color: '#FFFFFF', // white
      },
    },
    palette:{
      mode: 'dark',
      background:{
        paper: '#2C2F3D', // dark gray
        default: '#191B1F', // darkest gray
      },
      primary:{
        main: '#740E95', // purple
      },
      secondary:{
        main: '#7022E7', // lighter purple
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
      <GlobalStyle />
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Pools" element={<Pools />} />
              <Route path="/Pools/:poolAddress" element={<PoolPage />} />
              <Route path="/Tokens" element={<Tokens />} />
          </Routes>
        </BrowserRouter>        
      </ThemeProvider>
    </>
  )
}

export default App;
