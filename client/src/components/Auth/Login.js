import React, { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import {MicrosoftLogin} from "react-microsoft-login";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Context from "../../context";
import { ME_QUERY } from "../../graphql/queries";
import { BASE_URL } from "../../client";

// import AdLogin from "./AdLogin";


const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const authHandler = async (err, data) => {
    try {
      const idToken = data.accessToken
      console.log(idToken)
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken }
      });
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: true });
      
    } catch (err) {
      onFailure(err);
    }

  };
  const onFailure = err => {
    console.error("Error logging in", err);
    dispatch({ type: "IS_LOGGED_IN", payload: false });
  };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66, 133, 244)" }}
      >
        Welcome
      </Typography>
      {/* <GoogleLogin
        clientId="315966998828-po1vmcf3t2d0ksfbtja74fhu7ca3g2qc.apps.googleusercontent.com"
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
        buttonText="Login with Google"
        theme="dark"
      /> */}
      {/* <AdLogin /> */}

      <MicrosoftLogin
        withUserData={true}
        debug={true}
        clientId="c03aac7b-1ac9-43e5-8776-7a939f338ecb"
        tenantUrl="https://login.microsoftonline.com/cd3dacac-0f59-4ac5-931a-3d0d9c8ddb60"
        authCallback={authHandler}
        graphScopes={["user.read"]}
        redirectUri="http://localhost:3000"
      />

    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
