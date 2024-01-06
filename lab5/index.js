'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const request = require('request');

const Session = require('./Session');
const { getPublicKey, generateLoginRequestOptions } = require('./utils');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SESSION_KEY = 'Authorization';

const sessions = new Session();
let publicKey = null;

app.use(async (req, res, next) => {
    let currentSession = {};
    let sessionId = req.get(SESSION_KEY);

    if (sessionId) {
        try {
            const tokenValue = jwt.verify(sessionId, publicKey);
        } catch (err) {
            console.error(err);
            return res.status(401).end();
        }

        currentSession = sessions.getSession(sessionId);
    }

    req.session = currentSession;
    req.sessionId = sessionId;
    next();
});

app.get('/page-info', (req, res) => {
    if (req.session?.username) {
        return res.json({
            username: req.session.username,
            logout: 'http://localhost:3000/logout'
        });
    }

    res.json({
        error: 'Authentication was not successful. Try again'
    });
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;
    const options = generateLoginRequestOptions(login, password);

    request(options, (error, response, body) => {
        if (error) {
            throw new Error(error);
        }

        if (body) {
            const bodyjson = JSON.parse(body);

            if (bodyjson.error) {
                res.status(401).send();
            } else {
                sessions.setSession(bodyjson.access_token, { username: login });
                res.json({ token: bodyjson.access_token });
            }
        }
    });
});

app.get('/logout', (req, res) => {
    sessions.finish(req);
    res.redirect('/');
});

app.listen(port, async () => {
    publicKey = await getPublicKey();
    console.log(`Example app listening on port ${port}`);
});
