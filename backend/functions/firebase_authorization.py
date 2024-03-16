from fastapi import Depends, Security, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth

security = HTTPBearer()

#Retrieves current users Id based on the bearer token
def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials

    decoded_token = firebase_auth.verify_id_token(token)
    return decoded_token['uid']

