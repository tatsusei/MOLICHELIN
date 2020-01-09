import React, {useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTime from "@material-ui/icons/AccessTime";
import FaceIcon from "@material-ui/icons/Face";
import Context from '../../context'
import format from 'date-fns/format'
import CreateComment from '../Comment/CreateComment'
import Comments from '../Comment/Comments'
import LinkIcon from '@material-ui/icons/Link';
import Link from '@material-ui/core/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';


const PinContent = ({ classes }) => {
  const { state } = useContext(Context)
  const { title, content, author, createdAt, comments, url} = state.currentPin
  return (
    <div className = {classes.root}>
      { url ? 
        <Link href={url} component="h2" variant="h5" color="primary" gutterBottom >
          {title} <LinkIcon /> 
        </Link>
        : 
        <Typography component="h2" variant="h5" color="primary" gutterBottom >
          {title} 
        </Typography>
      }
      <Typography className={classes.text} component="h3" variant="h6" color="inherit" gutterBottom >
        <FaceIcon className ={classes.icon} /> {author.name}
      </Typography>

      <Typography variant="subtitle1" gutterBottom paragraph = {true} align = 'left'>
        {content}
      </Typography>

      <Typography className={classes.text} variant="subtitle2" color="inherit"  gutterBottom >
        {/* <AccessTime className={classes.icon} /> */}
        {format(Number(createdAt),"MMM Do, YYYY")}
      </Typography>

      {/* Pin Comments */}
      <CreateComment />
      <Comments comments={comments} >

      </Comments>

    </div>
  )
};

const styles = theme => ({
  root: {
    padding: "1em 0.5em",
    textAlign: "left",
    width: "100%"
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "left"
  }
});

export default withStyles(styles)(PinContent);
