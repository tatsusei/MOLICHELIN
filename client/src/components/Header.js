import React , {useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import Map from "@material-ui/icons/Map";
// import MapIcon from "@material-ui/icons/Map";
import RestaurantOutlinedIcon from '@material-ui/icons/RestaurantOutlined';
import Typography from "@material-ui/core/Typography";

import Context from '../context'
import Signout from  "../components/Auth/Signout"
import Button from '@material-ui/core/Button';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';


const Header = ({ classes }) => {
  const {state} = useContext(Context)
  const {currentUser} = state
  // return <div>Header</div>;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return(
  
  <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.grow} >
            <RestaurantOutlinedIcon className={classes.icon} />
            <Typography component="h1" variant="h6" color="inherit" noWrap>
             MOLICHELIN
            </Typography>
          </div>


          { /* Current user Info */}
          {currentUser && (
            <div className={classes.account} > 
              {/* <img className={classes.picture} src={currentUser.picture} alt={currentUser.name} /> */}

            <Button
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
               <Typography variant="h5" color="inherit" noWrap> 
                {currentUser.name} 
                </Typography> 
            </Button>

            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
                <MenuItem onClick={handleClose}><Signout></Signout></MenuItem>
              </Menu>
            </div>
          )}

          {/* Signout Button */}
          {/* <Signout></Signout> */}
        </Toolbar> 

      </AppBar>

    </div>
  )
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  account:{
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: theme.spacing.unit,
    color: "white",
    fontSize: 45
  },
  mobile: {
    display: "none"
  },
  picture: {
    height: "50px",
    borderRadius: "50%",
    marginRight: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Header);
