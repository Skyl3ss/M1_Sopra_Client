import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useParams, useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import { User } from "types";

const ProfileEntry = ({ user }: { user: User }) => {
  return(
    <div className="profileEntry">
      <div className="profileEntry container">
        <div className="profileEntry username">Username: {user.username}</div>
      </div>
      <div className="profileEntry container">
        <div className="profileEntry status">Online Status: {user.status}</div>
      </div>
      <div className="profileEntry container">
        <div className="profileEntry id">User-Id: {user.id}</div>
      </div>
      <div className="profileEntry container">
        <div className="profileEntry birthday">Birthday: {user.birthday}</div>
      </div>
      <div className="profileEntry container">
        <div className="profileEntry creationdate">Creation-Date: {user.creationDate}</div>
      </div>
    </div>
  );
};

ProfileEntry.propTypes = {
  user: PropTypes.object,
};

const Profile = () => {
  // access the Parameters given by the url 
  const { userid } = useParams();
  const navigate = useNavigate();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  const [users, setUsers] = useState<User[]>(null);
  const [editable,setEditable] = useState<Boolean>(false)

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users/" + userid);
        const token = localStorage.getItem("token")
        const requestBody = JSON.stringify({token})
        const boolresponse = await api.post("/checkUser/" + userid, requestBody)
        const { data } = boolresponse;
        setEditable(data)

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
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
      <div className="profileDisplay">
        <div className="profileDisplay user-list">
          <ProfileEntry user={users} />
          <div className="profileDisplay button-container">
            <Button width="100%" onClick={() => navigate("/game")}>
                Menu
            </Button>
            {editable &&(
              <Button width="100%" onClick={() => navigate("/editprofile/"+userid)}>
                Edit Profile
              </Button>
            )}
          </div> 
        </div>
      </div>
    );
  }

  return (
    <BaseContainer className="profile container">
      <h2>Profile Menu</h2>
      <p className="profile paragraph">
        Details
      </p>
      {content}

    </BaseContainer>
  );
};

export default Profile;
