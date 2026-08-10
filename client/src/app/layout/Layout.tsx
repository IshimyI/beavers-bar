import { getUserFavRecipesThunk } from "@/entities/recipe";
import { refreshTokensThunk } from "@/entities/user";
import { AlertContainer } from "@/features/alert";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHook";
//import { Footer } from "@/widgets/Footer/Footer";
import { Header } from "@/widgets/Header/Header";
import { JSX, useEffect } from "react";
import { Outlet, useLocation } from "react-router";

const pageTitles: Record<string, string> = {
  "/": "Main",
  "/signin": "Sign in",
  "/signup": "Sign up",
  "/bar": "Bar",
  "/journal": "Journal",
  "/admin": "Admin",
};

function getPageTitle(pathname: string): string {
  return pageTitles[pathname] || "Page";
}

export default function Layout(): JSX.Element {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.user?.id);
  const location = useLocation();

  useEffect(() => {
    dispatch(refreshTokensThunk());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserFavRecipesThunk(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const pageTitle = getPageTitle(location.pathname);
    document.title = `Culture | ${pageTitle}`;
  }, [location.pathname]);

  return (
    <>
      <Header />
      <AlertContainer />
      <Outlet />
    </>
  );
}
