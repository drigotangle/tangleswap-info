import { BrowserRouter, Routes, Route } from "react-router-dom"
import { createTheme, ThemeProvider  } from '@mui/material';

import Home from './pages/Home'
import GlobalStyle from "./style";

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
        default: '#1F1D2B'

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
          </Routes>
        </BrowserRouter>        
      </ThemeProvider>
    </>
  )
}

export default App;
