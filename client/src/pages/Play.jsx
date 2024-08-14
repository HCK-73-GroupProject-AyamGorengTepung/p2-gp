import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../helpers/socket";
import { useGameContext } from "../contexts/GameContext";
import Swal from "sweetalert2";

const Play = () => {
  const [country, setCountry] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const navigate = useNavigate();
  const { roomId, gameStarted, setGameStarted } = useGameContext();

  useEffect(() => {
    if (!roomId) {
      navigate("/home");
      return;
    }
    socket.emit("joinRoom", roomId);

    socket.on("startGame", (countryData) => {
      setCountry(countryData);
      setGameStarted(true);
      setTimer(10);
    });

    socket.on("timeUp", ({ message, newCountry }) => {
      Swal.fire({
        title: "Time's Up!",
        text: message,
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
      setCountry(newCountry);
      setTimer(10);
      setAnswer("");
    });

    socket.on("gameEnded", ({ message, won, score, totalScore }) => {
      const title = won ? "Congratulations!" : "Game Over";
      const icon = won ? "success" : "info";

      Swal.fire({
        title: title,
        html: `
          ${message}<br><br>
          Your Score: ${score}<br>
          Winning Score: ${totalScore}
        `,
        icon: icon,
        confirmButtonText: "Back to Home",
      }).then(() => {
        navigate("/home");
        setGameStarted(false);
        localStorage.clear();
      });
    });

    return () => {
      socket.off("startGame");
      socket.off("timeUp");
      socket.off("gameEnded");
    };
  }, [roomId, navigate, setGameStarted]);

  useEffect(() => {
    let interval;
    if (gameStarted && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, timer]);

  const HandleAnswer = async (e) => {
    e.preventDefault();
    if (answer.toLowerCase() === country?.answer.toLowerCase()) {
      const newScore = score + 1;
      setScore(newScore);

      Swal.fire({
        title: "Correct!",
        text: `You've got ${newScore} out of 5 answers right.`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      setAnswer("");
      socket.emit("correctAnswer", roomId);
    } else {
      Swal.fire({
        title: "Wrong Answer",
        text: "Please try again!",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white ms-[360px]">
      <div className="w-full max-w-3xl p-4">
        {gameStarted ? (
          <div className="bg-white rounded-lg shadow-lg shadow-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Guess the Country
              </h2>
              <div className="w-full h-[350px] aspect-video overflow-hidden rounded-lg mb-6 relative">
                <img
                  src={country.image}
                  alt="country"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  {timer}
                </div>
              </div>
              <form
                onSubmit={HandleAnswer}
                className="flex flex-col sm:flex-row gap-4 mb-6"
              >
                <input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="flex-grow px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter country name..."
                  type="text"
                />
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  type="submit"
                >
                  Confirm
                </button>
              </form>
              <div className="text-center">
                <span className="text-2xl font-semibold text-blue-600">
                  Your Score: {score} / 5
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <img
              className="mx-auto"
              src="https://cdn.pixabay.com/animation/2024/08/14/12/13/12-13-23-51_256.gif"
              alt=""
            />
            <h2 className="text-2xl font-bold text-[#0b4898] mb-4">
              Waiting for another player to join...
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;
