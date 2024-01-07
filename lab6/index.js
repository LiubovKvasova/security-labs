'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const Session = require('./Session');
const { generateLoginRequestOptions } = require('./utils');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sessions = new Session();

app.use((req, res, next) => {
    let currentSession = {};
    const sessionId = req.get('Authorization');

    if (sessionId) {
        currentSession = sessions.getSession(sessionId);
    }

    req.session = currentSession;
    req.sessionId = sessionId;
    next();
});

app.get('/page-info', (req, res) => {
    if (req.session.username) {
        return res.json({
            username: req.session.username,
            logout: 'http://localhost:3000/logout'
        });
    }

    res.json({
        error: 'Authentication was not successful. Try again'
    });
});

app.post('/api/codelogin', (req, res) => {
    const { code } = req.body;
    const options = generateLoginRequestOptions(code);

    request(options, function (error, response, body) {
        if (error) {
            throw new Error(error);
        }

        if (body) {
            const bodyjson = JSON.parse(body);

            if (bodyjson.error) {
                res.status(401).send();
            } else {
                sessions.setSession(bodyjson.access_token, { username: 'unknown' });
                res.json({ token: bodyjson.access_token });
            }
        }
    });
});

app.get('/login', (req, res) => {
    const queryParams = new URLSearchParams({
        client_id: 'JIvCO5c2IBHlAe2patn6l6q5H35qxti0',
        redirect_uri: 'http://localhost:3000',
        response_type: 'code',
        response_mode: 'query'
    });

    return res.redirect(`https://kpi.eu.auth0.com/authorize?${queryParams.toString()}`);
});

app.get('/logout', (req, res) => {
    sessions.finish(req, res);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
