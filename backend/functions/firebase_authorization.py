from fastapi import Depends, Security, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth

#token -based authentication instance
security = HTTPBearer()

#Retrieves current user
def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    #extracts token from credentials
    token = credentials.credentials

    #verifies the toekn using Firebase Authentication
    decoded_token = firebase_auth.verify_id_token(token)

    #returns the user id from the token
    return decoded_token['uid']

