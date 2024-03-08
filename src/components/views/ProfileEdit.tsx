import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useParams, useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/ProfileEdit.scss";


const ChangeField = (props) => {
  return (
    <div className="change field">
      <label className="change label">{props.label}</label>
      <input
        className="change input"
        placeholder="enter here.."
        type={props.type}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        autoFocus={props.autoFocus}
      />
    </div>
  );
};

ChangeField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  autoFocus: PropTypes.bool,
};

ChangeField.defaultProps = {
  autoFocus: false,
};

const ProfileEdit = () => {
  // access the Parameters given by the url 
  const { userid } = useParams();

  const navigate = useNavigate();

  const [username, setUsername] = useState<string>(null);
  const [birthday, setBirthday] = useState<string>(null);
  const [loading, setLoading] = useState(false)

  // in this case, the effect hook is only run once, the first time the component is mounted
  useEffect(() => {
    //async function for fetching user data
    async function fetchData() {
      try {
        const response = await api.get("/users/" + userid);

        // This is just a fake async call, so that the spinner can be displayed
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Get the returned user and update the state.
        setUsername(response.data.username);
        setBirthday(response.data.birthday);
        setLoading(true)

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

  //handle the save click as an execution
  const doChanges = async () => {
    const token = (localStorage.getItem("token"))
    const requestBody = JSON.stringify({ username, birthday, token});
    try {
      await api.put("/users/"+userid, requestBody);
    } catch (error) { 
      console.error(
        `Something went wrong while editing the user: \n${handleError(
          error
        )}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while editing the user! See the console for details."
      );
    }
    navigate("/profile/"+userid)
  }
  
  let content = <Spinner />;

  if (loading) {
    content = (
      <div className="change container">
        <div className="change form">
          <ChangeField
            label="Username"
            type="text"
            value={username}
            onChange={(un: string) => setUsername(un)}
            autoFocus={true}
          />
          <ChangeField
            label="Birthday"
            type="date"
            value={birthday}
            onChange={(n: string) => setBirthday(n)}
          />
          <div className="change button-container">
            <Button width="100%" onClick={() => doChanges()}>
                Save
            </Button>
            <Button width="100%" onClick={() => navigate("/profile/"+userid)}>
                Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BaseContainer className="profileEdit container">
      <h2>Profile Menu</h2>
      <p className="profileEdit paragraph">
        Edit Details
      </p>
      {content}

    </BaseContainer>
  );
};

export default ProfileEdit;
