import { GraphQLClient } from 'graphql-request'
import { useState, useEffect } from 'react'

import {
    msalApp,
    requiresInteraction,
    fetchMsGraph,
    isIE,
    GRAPH_ENDPOINTS,
    GRAPH_SCOPES,
    GRAPH_REQUESTS
} from "./auth-utils";

export const BASE_URL = 
    process.env.NODE_ENV === "" ? "<production-url>" : "http://localhost:4000/graphql"

export const useClient = () => {

    const [ idToken, setIdToken ] = useState("")
    useEffect(()=> {
        // const token = window.gapi.auth2
        //     .getAuthInstance()
        //     .currentUser.get()
        //     .getAuthResponse()
        //     .id_token;

        msalApp.acquireTokenSilent(GRAPH_REQUESTS.LOGIN).then(function(response) {
            const token = response.accessToken
            setIdToken(token)
            }
        ).catch(function (err) {  
            console.log("acquireTokenSilent:", err)
                //handle error
    });

    },[])

    return new GraphQLClient(BASE_URL, {
        headers: {authorization: idToken }
    })


}