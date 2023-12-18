#!/bin/bash

oauth_refresh_token=$(curl -X POST 'https://kpi.eu.auth0.com/oauth/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=authorization_code&client_id=JIvCO5c2IBHlAe2patn6l6q5H35qxti0&client_secret=ZRF8Op0tWM36p1_hxXTU-B0K_Gq_-eAVtlrQpY24CasYiDmcXBhNS6IJMNcz1EgB&code=5C0wYbgtNXc_FhKUZN1C8onfq35Y3YAB5EvDK6ND6mrYy&redirect_uri=http://localhost:3000' \
  | jq -r .refresh_token)

curl -X POST 'https://kpi.eu.auth0.com/oauth/token' \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -d "grant_type=refresh_token&client_id=JIvCO5c2IBHlAe2patn6l6q5H35qxti0&client_secret=ZRF8Op0tWM36p1_hxXTU-B0K_Gq_-eAVtlrQpY24CasYiDmcXBhNS6IJMNcz1EgB&refresh_token=${oauth_refresh_token}"
