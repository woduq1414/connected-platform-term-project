import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CustomClassNameSetup";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";

import store from "./store";
import { extendedApi } from "./store/slices/configuration";
import palette from "./theme/palette";
import router from "./routes";
import MainLoadingScreen from "./components/MainLoadingScreen";

import "./fonts/font.css";
import GlobalProvider from "./providers/GlobalProvider";
import { Toaster } from "react-hot-toast";

import "./styles/customMain.css";

store.dispatch(extendedApi.endpoints.getConfiguration.initiate(undefined));

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <GlobalProvider>
      <Toaster />
      <ThemeProvider theme={createTheme({ palette })}>
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            bgcolor: "background.default",
            position: "relative",
          }}
        >
          <RouterProvider
            router={router}
            fallbackElement={<MainLoadingScreen />}
          />
        </Box>
      </ThemeProvider>
    </GlobalProvider>
    {/* </React.StrictMode> */}
  </Provider>
);
