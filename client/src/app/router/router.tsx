import { BrowserRouter, Routes, Route } from "react-router";
import {
  JournalPage,
  MainPage,
  NotFoundPage,
  SignInPage,
  SignUpPage,
} from "@/pages";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import Layout from "../layout/Layout";
import MyBarPage from "@/pages/MyBarPage/MyBarPage";
import { AdminPage } from "@/pages/AdminPage/AdminPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={CLIENT_ROUTES.MAIN} element={<Layout />}>
          <Route path={CLIENT_ROUTES.MAIN} element={<MainPage />} />
          <Route path={CLIENT_ROUTES.SIGN_IN} element={<SignInPage />} />
          <Route path={CLIENT_ROUTES.SIGN_UP} element={<SignUpPage />} />
          <Route path={CLIENT_ROUTES.MY_BAR} element={<MyBarPage />} />
          <Route path={CLIENT_ROUTES.JOURNAL} element={<JournalPage />} />
          <Route path={CLIENT_ROUTES.ADMIN} element={<AdminPage />} />
          <Route path={CLIENT_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
