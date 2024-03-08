import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, Navigate, Outlet } from "react-router-dom";
import { api } from "helpers/api";

/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * <Outlet /> is rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */
export const ProfileGuard = () => {
  const [editable, setEditable] = useState(true);
  const { userid } = useParams();
  const token = localStorage.getItem("token");
    
  useEffect(() => {
    async function fetchData() {
      try {
        const requestBody = JSON.stringify({ token });
        const boolresponse = await api.post("/checkUser/" + userid, requestBody);
        const { data } = boolresponse;
        setEditable(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error
      }
    };
  
    fetchData();
  }, []);
  if (editable) {

    return <Outlet />;

  } else if (token) {

    return <Navigate to="/game" replace />;
  }
  
  return <Navigate to="/login" replace />;
};
  
ProfileGuard.propTypes = {
  children: PropTypes.node
};