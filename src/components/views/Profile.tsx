import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useParams, useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import { User } from "types";

const Person = ({ user }: { user: User }) => {
  return(
    <div>
      <div className="person container">
        <div className="person username">Username: {user.username}</div>
      </div>
      <div className="person container">
        <div className="person status">Online Status: {user.status}</div>
      </div>
      <div className="person container">
        <div className="person id">User-Id: {user.id}</div>
      </div>
      <div className="person container">
        <div className="person birthday">Birthday: {user.birthday}</div>
      </div>
      <div className="person container">
        <div className="person creationdate">Creation-Date: {user.creationDate}</div>
      </div>
    </div>
  );
};

Person.propTypes = {
  user: PropTypes.object,
};

const Profile = () => {
  // access the Parameters given by the url 
  const { userid } = useParams();
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://react.dev/learn/state-a-components-memory and https://react.dev/reference/react/useState 
  const [users, setUsers] = useState<User[]>(null);

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://react.dev/reference/react/useEffect 
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/getUser/" + userid);

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Get the returned users and update the state.
        setUsers(response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="game">
        <div className="game user-list">
          <Person user={users} />
        </div>
        <Button width="100%" onClick={() => navigate("/game")}>
            Menu
        </Button>
        <Button width="100%" onClick={() => navigate("/editprofile/"+userid)}>
            Edit Profile to be implemented
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Profile Menu</h2>
      <p className="game paragraph">
        Details
      </p>
      {content}

    </BaseContainer>
  );
};

export default Profile;
