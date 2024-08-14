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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="font-bold text-4xl my-10">Online Multiplayer Game</h1>
      <div className="space-x-4">
        <button
          className="px-5 py-2.5 rounded-lg text-white text-sm tracking-wider font-medium border border-blue-800 outline-none bg-blue-700 hover:bg-blue-800 active:bg-blue-600"
          type="button"
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
        <button
          className="px-5 py-2.5 rounded-lg text-white text-sm tracking-wider font-medium border border-green-800 outline-none bg-green-700 hover:bg-green-800 active:bg-green-600"
          type="button"
          onClick={handleJoinRoom}
        >
          Join Random Room
        </button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Home;