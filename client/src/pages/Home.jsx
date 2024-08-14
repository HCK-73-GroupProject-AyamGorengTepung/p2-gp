import { useState, useEffect } from "react";
import socket from "../helpers/socket";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../contexts/GameContext";

const Home = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setRoomId } = useGameContext();

  useEffect(() => {
    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('roomFull');
      socket.off('noRooms');
    };
  }, []);

  const handleCreateRoom = () => {
    setError(""); 
    socket.emit('createRoom');
    socket.once('roomCreated', (roomId) => {
      setRoomId(roomId);
      navigate('/play');
    });
  };

  const handleJoinRoom = () => {
    setError(""); // 
    socket.emit('joinRandomRoom');
    socket.once('roomJoined', (roomId) => {
      setRoomId(roomId);
      navigate('/play');
    });
    
    socket.once('roomFull', () => setError('Room is full, try again.'));
    socket.once('noRooms', () => setError('No rooms available. Try creating a room.'));
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://e1.pxfuel.com/desktop-wallpaper/908/431/desktop-wallpaper-flags-of-the-world-country-flags.jpg')`,
      }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-2xl backdrop-blur-md transform transition duration-500 hover:scale-105 hover:shadow-xl">
        <div className="w-full h-[250px] overflow-hidden rounded-lg mb-4">
          <img
            src="https://i.ibb.co.com/fX4bKMy/Guess-The-Countries-4-removebg-preview.png"
            alt="country"
            className="h-full w-full object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="space-x-4 flex justify-center">
          <button
            className="px-5 py-2.5 rounded-lg text-white text-sm tracking-wider font-medium border border-transparent bg-blue-700 hover:bg-blue-800 active:bg-blue-700 transform transition duration-300 hover:scale-105"
            type="button"
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
          <button
            className="px-5 py-2.5 rounded-lg text-white text-sm tracking-wider font-medium border border-transparent bg-green-700 hover:bg-green-800 active:bg-green-700 transform transition duration-300 hover:scale-105"
            type="button"
            onClick={handleJoinRoom}
          >
            Join Random Room
          </button>
        </div>
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default Home;