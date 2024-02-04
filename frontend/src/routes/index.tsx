import { ElementType, lazy, Suspense } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import MainLoadingScreen from "src/components/MainLoadingScreen";
import { MAIN_PATH } from "src/constant";

import MainLayout from "src/layouts/MainLayout";
import WatchLayout from "src/layouts/WatchLayout";
import LoginPage from "src/pages/LoginPage";
import RegisterPage from "src/pages/RegisterPage";

const Loadable = (Component: ElementType) => (props: any) => {
  return (
    <Suspense fallback={<MainLoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

const HomePage = Loadable(lazy(() => import("src/pages/HomePage")));
const GenreExplorePage = Loadable(lazy(() => import("src/pages/GenreExplore")));
const WatchPage = Loadable(lazy(() => import("src/pages/WatchPage")));
const SearchPage = Loadable(lazy(() => import("src/pages/SearchPage")));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: MAIN_PATH.root,
        element: <Navigate to={`/${MAIN_PATH.browse}`} />,
      },
      {
        path: MAIN_PATH.browse,
        element: <HomePage />,
      },
    
      {
        path: MAIN_PATH.genreExplore,
        children: [{ path: ":genreId", element: <GenreExplorePage /> }],
      },
      {
        path: MAIN_PATH.search,
        children: [{ path: ":target", element: <SearchPage /> }],
      }
    ],
  },
  {
    path: MAIN_PATH.register,
    element : <RegisterPage/>
  },
  {
    path: MAIN_PATH.login,
    element : <LoginPage/>
  },
  {
    path: MAIN_PATH.watch,
    element: <WatchLayout />,
    children: [
      {
        path: "",
        children: [{ path: ":watchId", element: <WatchPage /> }],
      },
    ],
  },
  
]);

export default router;
