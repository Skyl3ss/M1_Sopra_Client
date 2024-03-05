import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useParams, useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/ProfileEdit.scss";
import { User } from "types";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        type={props.type}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
};


const ProfileEdit = () => {
  // access the Parameters given by the url 
  const { userid } = useParams();

  const navigate = useNavigate();

  const [user, setUser] = useState<User[]>(null);
  const [username, setUsername] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");

  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/users/" + userid);

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Get the returned users and update the state.
        setUser(response.data);
        console.log(response);

        setUsername(response.data.username);
        setBirthday(response.data.birthday);

      } catch (error) {
        console.error(
          `Something went wrong while fetching the user: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the user! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  
  const Person = ({ user }: { user: User }) => {
    return(
      <div>
        <div className="person container">
          <FormField
            label="Username"
            type="text"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
        </div>
        <div className="person container">
          <FormField
            label="Birthday"
            type="date"
            value={birthday}
            onChange={(un: string) => setBirthday(un)}
          />
        </div>
      </div>
    );
  };

  Person.propTypes = {
    user: PropTypes.object,
  };

  const doChanges = async () => {
    user.username = username
    user.birthday = birthday
    const token = (localStorage.getItem("token"))
    console.log(user)
    const requestBody = JSON.stringify({ username, birthday, token});
    // catch errors TO BE IMPLEMENTED
    const response = await api.put("/users/"+user.id, requestBody);
    console.log(response)
    navigate("/profile/"+userid)
  }
  let content = <Spinner />;
  //handle the save click as an execution
  if (user) {
    content = (
      <div className="game">
        <div className="game user-list">
          <Person user={user} />
        </div>
        <Button width="100%" onClick={() => doChanges()}>
            Save
        </Button>
        <Button width="100%" onClick={() => navigate("/profile/"+userid)}>
            Cancel
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

export default ProfileEdit;
