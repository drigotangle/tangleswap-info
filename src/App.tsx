import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { createTheme, ThemeProvider  } from '@mui/material';

import Home from './pages/Home'

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
        paper: '#1F1D2B',
        default: '#1F1D2B'

      },
      primary:{
        main: '#7022E7',
      },
      secondary:{
        main: '#7022E7'
      }
    }

  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>        
      </ThemeProvider>
    </>
  );
}

export default App;
