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
    <div className="w-full h-screen justify-center">
      <form
        onSubmit={HandleAddUsername}
        className="flex border-2 border-blue-500 overflow-hidden max-w-md font-[sans-serif] ms-[360px] mt-60 text-center justify-center"
      >
        <input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-3"
          placeholder="Enter username..."
          type="text"
        />
        <button
          className="flex items-center justify-center bg-[#007bff] px-5 text-sm text-white"
          type="submit"
        >
          Confirm
        </button>
      </form>
    </div>
  );
};

export default AddUsernamePage;
