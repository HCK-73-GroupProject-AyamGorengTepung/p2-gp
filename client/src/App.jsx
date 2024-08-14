import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import socket from "./helpers/socket";
import Home from "./pages/Home";
import AddUsernamePage from "./pages/AddUsername";
import MainLayout from "./pages/MainLayout";
import Play from "./pages/Play";
import { GameProvider } from "./contexts/GameContext";

socket;

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <AddUsernamePage />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/play",
        element: <Play />,
      },
    ],
  },
]);

function App() {
  return (
    <GameProvider>
      <RouterProvider router={router} />
    </GameProvider>
  );
}

export default App;