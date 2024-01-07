"use strict";

const generateLoginRequestOptions = (code) => ({
    method: 'POST',
    url: 'https://kpi.eu.auth0.com/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
        client_id: 'JIvCO5c2IBHlAe2patn6l6q5H35qxti0',
        audience: 'https://kpi.eu.auth0.com/api/v2/',
        code: code,
        redirect_uri: 'http://localhost:3000/',
        scope: 'offline_access',
        client_secret: 'ZRF8Op0tWM36p1_hxXTU-B0K_Gq_-eAVtlrQpY24CasYiDmcXBhNS6IJMNcz1EgB',
        grant_type: 'authorization_code'
    }
});

module.exports = {
    generateLoginRequestOptions
};
