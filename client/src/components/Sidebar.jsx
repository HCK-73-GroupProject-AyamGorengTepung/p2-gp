import { useEffect, useState } from "react";
import socket from "../helpers/socket";

const Sidebar = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on("online:users", (args) => {
      console.log(args);
      setOnlineUsers(args);
    });
  }, []);

  return (
    <>
      <nav className="bg-white shadow-lg h-screen fixed top-0 left-0 min-w-[250px] py-6 px-4 font-[sans-serif] overflow-auto">
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-inherit text-base-content min-h-full w-80 p-4">
            <img
              className="h-auto max-w-l rounded-lg"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Logo_Tebak_Gambar.png/768px-Logo_Tebak_Gambar.png"
              alt=""
            />
            <p
              className="text-bold text-gray-900"
              style={{ marginLeft: 25, marginBottom: 20, marginTop: 30 }}
            >
              Players Online :
            </p>
            {onlineUsers.map((el) => {
              return (
                <li key={el.id}>
                  <div className="flex">
                    <div className="relative">
                      <img
                        className="w-10 h-10 rounded-full"
                        style={{ marginLeft: 10 }}
                        src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
                        alt=""
                      />
                      <span className="top-0 left-9 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
                    </div>
                    <div className="pl-11 text-gray-900">
                      {el.username}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
