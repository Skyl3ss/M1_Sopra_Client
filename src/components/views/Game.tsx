import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";

const Player = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  return(
    <div className="player container"
      onClick={() => navigate(`/profile/${user.id}`)}
    >
      <div className="player username">{user.username}</div>
      <div className="player status">{user.status}</div>
      <div className="player id">id: {user.id}</div>
    </div>
  );
};

Player.propTypes = {
  user: PropTypes.object,
};

const Game = () => {
  const navigate = useNavigate();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  const [users, setUsers] = useState<User[]>(null);

  const logout = (): void => {
    const token = (localStorage.getItem("token"))
    const status = "OFFLINE"
    const requestBody = JSON.stringify({ token, status }); // Construct the request body
    api.put("/status", requestBody) // Send the put request to your API endpoint
      .then(response => {
        console.log(response); // Log the response if needed
        localStorage.removeItem("token"); // Remove token from localStorage
        navigate("/login"); // Navigate to the login page
      })
      .catch(error => {
        console.error("Error:", error); // Log any errors
        localStorage.removeItem("token");
        navigate("/login")
      });
  }
  

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users");

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);

        // Logging the user data in the console
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        localStorage.removeItem("token");
        alert(
          "Something went wrong while fetching the users! Please login again."
        );
      }
    }

    fetchData();
  }, []);

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {users.map((user: User) => (
            <li key={user.id}>
              <Player user={user} />
            </li>
          ))}
        </ul>
        <Button width="100%" onClick={() => logout()}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Happy Coding!</h2>
      <p className="game paragraph">
        Get all users from secure endpoint:
      </p>
      {content}
    </BaseContainer>
  );
};

export default Game;
