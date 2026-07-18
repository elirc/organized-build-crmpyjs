import { createBrowserRouter } from "react-router-dom";

import { App } from "../App";
import { LoginPage } from "../auth/LoginPage";
import { RequireAuth } from "../auth/RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <App />
      }
    ]
  }
]);
