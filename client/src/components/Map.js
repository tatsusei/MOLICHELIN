import React, {useState, useEffect, useContext}from "react";
import ReactMapGL, {NavigationControl, Marker, Popup, GeolocateControl } from "react-map-gl";
import { withStyles } from "@material-ui/core/styles";
import differenceInMinutes from 'date-fns/difference_in_minutes'
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import Geocoder from "react-geocoder-autocomplete";

import { unstable_useMediaQuery as useMediaQuery} from "@material-ui/core/useMediaQuery"

import { useClient } from '../client';
import { GET_PINS_QUERY } from '../graphql/queries';
import { DELETE_PIN_MUTATION } from '../graphql/mutations';

import {PIN_ADDED_SUBSCRIPTION,PIN_UPDATED_SUBSCRIPTION,PIN_DELETED_SUBSCRIPTION } from '../graphql/subscriptions'
import PinIcon from './PinIcon';
import Blog from './Blog';
import Context from '../context';

import { Subscription } from 'react-apollo'

const INITIAL_VIEWPORT ={
  latitude:35.6698792,
  longitude:139.7463783,
  zoom: 16
};

const Map = ({ classes }) => {
  const client = useClient();
  // const mobileSize = useMediaQuery('(max-width : 650px)')
  const { state, dispatch } = useContext(Context);
  const [viewport, setViewPort]=useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition ] = useState(null);
  useEffect(() => {
    getUserPosition();
  }, []);
  const [ popup, setPopup ] = useState(null);
  // remove pop if pin itself is deleted by the author of the pin
  useEffect(()=>{
    const pinExists = popup && state.pins.findIndex (pin => pin._id === popup._id) > -1
    if (!pinExists) {
      setPopup(null);
    }
  },[state.pins.length]);

  useEffect(() => {
    getPins();
  },[]);

  const getUserPosition = () =>{
    if ("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(position =>{
        const {latitude, longitude} = position.coords
        setViewPort({...viewport, latitude,longitude})
        setUserPosition({latitude,longitude})
      });

    }
  };

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: "GET_PINS", payload: getPins });
    console.log({getPins})

 }
  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }
    const [longitude, latitude] = lngLat;
    dispatch ({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { longitude, latitude}
    });
  };

  const highlightNewPin = pin => {
    const  isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30
    return isNewPin ? "limegreen" : "darkblue";
  }

  const handleSelectPin = pin => {
    setPopup(pin)
    dispatch({type: "SET_PIN", payload: pin})
  }

  const isAuthUser = () => state.currentUser._id === popup.author._id

  const handleDeletePin = async pin => {
    const variables = { pinId: pin._id}
    await client.request(DELETE_PIN_MUTATION, variables)
    // dispatch({ type: "DELETE_PIN", payload: deletePin })
    setPopup(null)
  }

  const handleSeletGeoCode = (item)  => {
    const latitude = Number(item.center[1].toFixed(6))
    const longitude = Number (item.center[0].toFixed(6))
    setViewPort({...viewport, latitude,longitude})
  } 

  return (
  <div className={ classes.root}>
      <ReactMapGL
      width="100vw"
      height="calc(100vh - 64px)"
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxApiAccessToken="pk.eyJ1IjoiZG91YmxlZHJhZ29udGF6IiwiYSI6ImNrMTI5eDllNjAxNzgzcW16ejJvc3k5a2UifQ.0ot0TfKUMS3uv7OIfM-mwg"
     // scrollZoom ={!mobileSize}
      onViewportChange={newViewport=> setViewPort(newViewport)}
      onClick={handleMapClick}
      {...viewport}
    >
      {/*Navigation Control */}
      <div className={classes.navigationControl}>
        <NavigationControl
        onViewportChange={newViewport=> setViewPort(newViewport)} />
      </div>

      <div className = {classes.geoCoder}>
        <Geocoder 
          accessToken='pk.eyJ1IjoiZG91YmxlZHJhZ29udGF6IiwiYSI6ImNrMTI5eDllNjAxNzgzcW16ejJvc3k5a2UifQ.0ot0TfKUMS3uv7OIfM-mwg'
          onSelect={handleSeletGeoCode}
          showLoader={true}
          inputClass={classes.getCoderInput}
        /> 
      </div>


    {/* Pin for user's current position */}
    {userPosition && (
      <Marker
        latitude={userPosition.latitude}
        longitude={userPosition.longitude}
        offsetLeft={-19}
        offsetTop={-37}
      >
        <div>You are here</div>
        <PinIcon size={40} color="red"/>
      </Marker>
    )}

    {/* Draft Pin */}
    {state.draft && (
      <Marker
        latitude={state.draft.latitude}
        longitude={state.draft.longitude}
        offsetLeft={-19}
        offsetTop={-37}
    >
      <PinIcon size={40} color="hotpink"/>
    </Marker>

    )}

    {/* created pins */}
    {state.pins.map(pin =>(

      <Marker
        key={pin._id}
        latitude={pin.latitude}
        longitude={pin.longitude}
        offsetLeft={-19}
        offsetTop={-37}
      >
      <PinIcon
        onClick={() => handleSelectPin(pin)  }
        size={40}
        color={ highlightNewPin(pin) }/>
      </Marker>
    ))}

    {/* Popup Dialog for Created Pin */}
    {popup && (
      <Popup
        anchor="top"
        title={popup.title}
        latitude={popup.latitude}
        longitude={popup.longitude}
        closeOnClick={false}
        onClose={()=>setPopup(null)}
      >
        <Typography
          noWrap
          variant="subtitle1"
          align ="center"
          color="textPrimary"
        >
          {popup.title}
        </Typography>

        <img
          className={classes.popupImage}
          src={popup.image}
          alt={popup.title}
        />
        <div className={classes.pupupTab}>
          <Typography>
            {popup.latitude.toFixed(6)},{popup.longitude.toFixed(6)}
          </Typography>
          {isAuthUser() && (
            <Button onClick ={() => handleDeletePin(popup)}>
              <DeleteIcon className={classes.deleteIcon} />
            </Button>
          )}
        </div>
      </Popup>
    )}

    </ReactMapGL>

    {/* Subscription for Creating Updating Delteing Pin */}

    <Subscription
      subscription = { PIN_ADDED_SUBSCRIPTION }
      onSubscriptionData={({ subscriptionData }) => {
        const {pinAdded} = subscriptionData.data
        console.log({pinAdded})
        dispatch({ type: "CREATE_PIN", payload: pinAdded })
      }}

    />


    <Subscription
          subscription = { PIN_UPDATED_SUBSCRIPTION }
          onSubscriptionData={({ subscriptionData }) => {
            const {pinUpdated} = subscriptionData.data
            console.log({pinUpdated})
            dispatch({ type: "CREATE_COMMENT", payload: pinUpdated })
          }}

        />

    <Subscription
          subscription = { PIN_DELETED_SUBSCRIPTION }
          onSubscriptionData={({ subscriptionData }) => {
            const {pinDeleted} = subscriptionData.data
            console.log({pinDeleted})
            dispatch({ type: "DELETE_PIN", payload: pinDeleted })
          }}

        />

    {/* Blog area to add pin content */}
    <Blog />

  </div>
    );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    bottom: "1em",
    left: 0,
    margin: "1em"
  },
  geoCoder: {
    fontSize: '18px',
    lineHeight: '24px',
    zIndex:1,
    position: 'relative',
    backgroundColor: '#fff',
    width: '50%',
    borderRadius: '4px',
    },
  getCoderInput: {
    font: 'inherit',
    width: '100%',
    border: 0,
    backgroundColor: 'transparent',
    margin: 0,
    height: '50px',
    color: '#404040', /* fallback */
    color: 'rgba(0, 0, 0, 0.75)',
    padding: '6px 45px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  deleteIcon: {
    color: "red",
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
