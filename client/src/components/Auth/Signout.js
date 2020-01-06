import React, {useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import {msalApp} from '../../auth-utils'

import Context from '../../context'

const Signout = ({ classes }) => {
  const {dispatch} = useContext(Context)

  const onSignout = () => {
    
    dispatch({ type: "SIGNOUT_USER" })
    msalApp.logout()
    console.log("Signed out")
  }

  return (

      <span className={classes.root} onClick={onSignout}>
        <Typography variant="body1" className={classes.buttonText}>
          Signout
        </Typography>
        <ExitToApp className={classes.buttonIcon} />
      </span>
    
  )
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonText: {
    color: "orange"
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "orange"
  }
};

export default withStyles(styles)(Signout);
