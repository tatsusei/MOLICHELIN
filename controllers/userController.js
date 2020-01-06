const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);
const axios = require('axios');

const GRAPH_ENDPOINTS = {
  ME: "https://graph.microsoft.com/v1.0/me",
  MAIL: "https://graph.microsoft.com/v1.0/me/messages"
};

const GRAPH_SCOPES = {
  OPENID: "openid",
  PROFILE: "profile",
  USER_READ: "User.Read",
  MAIL_READ: "Mail.Read"
};

const GRAPH_REQUESTS = {
  LOGIN: {
      scopes: [
          GRAPH_SCOPES.OPENID,
          GRAPH_SCOPES.PROFILE,
          GRAPH_SCOPES.USER_READ
      ]
  },
  EMAIL: {
      scopes: [GRAPH_SCOPES.MAIL_READ]
  }
};

const fetchMsGraph = async (url, accessToken) => {
  const response = await axios.get(url, {
      headers: {
          Authorization: `Bearer ${accessToken}`
      }
  });

  return response
};

// exports.findOrCreateUser = async token => {
//   // verify auth token
//   const googleUser = await verifyAuthToken(token);
//   // check if the user exists
//   const user = await checkIfUserExists(googleUser.email);
//   // if user exists, return them; otherwise, create new user in db
//   return user ? user : createNewUser(googleUser);
// };

exports.findOrCreateUser = async token => {
  // verify auth token
  const adUser = await adVerifyAuthToken(token);
  console.log(adUser);
  // check if the user exists
  const user = await checkIfUserExists(adUser.data.mail);
  // if user exists, return them; otherwise, create new user in db
  return user ? user : createNewUser(adUser);
};


const verifyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (err) {
    console.error("Error verifying auth token", err);
  }
};

const adVerifyAuthToken = async token => {
  console.log(token)
  try {
    const graphProfile = await fetchMsGraph(
      GRAPH_ENDPOINTS.ME, token)
    return graphProfile
  } catch (err) {
    console.error("Error ad verifying auth token", err);
  }
}

const checkIfUserExists = async email => await User.findOne({ email }).exec();

// const createNewUser = googleUser => {
//   const { name, email, picture } = googleUser;
//   const user = { name, email, picture };
//   return new User(user).save();
// };
const createNewUser = adUser => {
  const { displayName, mail } = adUser.data;
  const name =displayName;
  const email = mail;
  const user = { name, email };
  return new User(user).save();
};