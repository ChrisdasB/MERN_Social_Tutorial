import { Home } from "@mui/icons-material";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material"; // Large UI library
import { createTheme } from "@mui/material/styles"; // MUI =  Material UI - Styling framework
import { themeSettings } from "theme";

function App() {
  // Get infos from the store
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
     <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/"/>}></Route>
          <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/"/>}></Route>
        </Routes>
      </ThemeProvider>
     </BrowserRouter>
    </div>
  );
}

export default App;
