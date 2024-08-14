import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../helpers/socket";

const AddUsernamePage = () => {
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const HandleAddUsername = (e) => {
    e.preventDefault();


    socket.auth = { username: username };
    socket.disconnect().connect();
    localStorage.setItem("username", username);
    navigate("/home");
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-end bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://cdn-0001.qstv.on.epicgames.com/uorYEGIgunHZcagexk/image/landscape_comp.jpeg)",
      }}
    >
      <form
        onSubmit={HandleAddUsername}
        className="flex flex-col border-2 border-blue-500 rounded-lg overflow-hidden w-full max-w-4xl text-center justify-center bg-white bg-opacity-90 shadow-lg p-6 mb-16"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Welcome!</h2>
        <input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className="w-full outline-none bg-gray-100 text-gray-600 text-sm px-4 py-3 rounded-md mb-4"
          placeholder="Enter username..."
          type="text"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 transition duration-300 px-6 py-3 text-sm text-white font-semibold rounded-md"
          type="submit"
        >
          Confirm
        </button>
      </form>
    </div>
  );
};

export default AddUsernamePage;
