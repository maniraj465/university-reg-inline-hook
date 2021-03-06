const express = require('express');
const axios = require('axios');
const { regInlineHookCommandsMapping, regInlineHookErrorMapping } = require('./responseObject');

const API_GATE_WAY_URL = 'https://cg3q7axbka.execute-api.us-east-1.amazonaws.com/stg?email=';

const app = express();

// CORS
const EXT_CORS_ALLOW_METHODS = 'GET,POST,OPTIONS,PUT,DELETE';
const EXT_CORS_ALLOW_HEADERS = 'Content-Type,authorization,origin,accept';
const ORIGIN = 'http://localhost:8080';

const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', ORIGIN);
    res.header('Access-Control-Allow-Methods', EXT_CORS_ALLOW_METHODS);
    res.header('Access-Control-Allow-Headers', EXT_CORS_ALLOW_HEADERS);
    res.header('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    } else {
    next();
    }
};

app.use(allowCrossDomain);
app.use(express.json());

app.post('/register', async (req, res) => {
    const payload = req.body.data.userProfile;
    console.log(payload);
    const registrationEmail = payload.email;
    const dynamoDBTargetUrl = API_GATE_WAY_URL + registrationEmail;
    const userProfile = await getUserAWS(dynamoDBTargetUrl, registrationEmail);
    res.send(userProfile);
});

app.get('/', async (req, res) => {
    const user = {
        role: "developer"
    };
    res.send(user);
});

async function getUserAWS(targetUrl, registrationEmail) {
    const response = await axios.get(targetUrl)
    .then(res => {
        if(res && res.status && res.status === 200) {
            if(res && res.data && res.data.Count && res.data.Count === 0) {
                const exception = {
                    statusCode: 404,
                    message: 'User not found with this email!'
                };
                return regInlineHookErrorMapping(exception);
            } else {
                const usiversityEmail = res.data.Items[0].email.S;
                if(registrationEmail !== usiversityEmail) {
                    const exception = {
                        statusCode: 400,
                        message: 'Email doesn\'t match with university email!'
                    };
                    return regInlineHookErrorMapping(exception);
                }
                return regInlineHookCommandsMapping(res.data.Items[0]);
            }
        } else {
            const exception = {
                statusCode: 500,
                message: 'Server unavailable, Please try again!'
            };
            return regInlineHookErrorMapping(exception);
        }
    })
    .catch(error => {
        const exception = {
            statusCode: 500,
            message: 'Server unavailable, Please try again!'
        };
        return regInlineHookErrorMapping(exception);
    });
    return response;
}

const port = process.env.PORT || '6000';
app.listen(port, () => console.log(`Server started on Port ${port}`));