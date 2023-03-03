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
    },
    palette:{
      mode: 'dark',
      background:{
        paper: '#191B1F',
        default: '#191B1F'

      },
      primary:{
        main: '#191B1F',
      },
      secondary:{
        main: '#7022E7'
      }
    }

  })

  return (
    <>
      <ThemeProvider theme={theme}>
      <GlobalStyle />
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Pools" element={<Pools />} />
              <Route path="/Pools/:poolAddress" element={<Pools />} />
              <Route path="/Tokens" element={<Tokens />} />
          </Routes>
        </BrowserRouter>        
      </ThemeProvider>
    </>
  )
}

export default App;
