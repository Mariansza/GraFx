const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = 3000;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
let authToken ;
 
app.use(cors());

async function getToken() {
    const url = 'https://integration-login.chiligrafx.com/oauth/token';
     const data = {
    client_id: `${client_id}`,
    client_secret: `${client_secret}`,
    audience: 'https://chiligrafx.com',
    grant_type: 'client_credentials',
    };

    try {
    const response = await axios.post(url, data, {
        headers: {
        'Content-Type': 'application/json',
        },
    });
        
    authToken = response.data.access_token;
    console.log(response.data.access_token);
    return response.data.access_token;
    
    } catch (error) {
    console.error('Error in getting token:', error);
    throw error;
    }
}

app.use(express.json());

app.get('/token', async (req, res) => {
    try {
    const token = await getToken();
    res.json({token});
    } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
    }
});
    
app.get('/get-image-data', async (req, res) => {
    try {
        const apiUrl =
        "https://internship-marian.chili-publish-sandbox.online/grafx/api/v1/environment/internship-marian/media?limit=50&sortBy=name&sortOrder=asc";
        const resp = await axios.get(apiUrl, {
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        });
    
        if (!resp.data || !resp.data.data) {
        throw new Error('Failed to fetch image data.');
        }
    
        res.send(resp.data);
    } catch (error) {
        console.error("Error fetching image data:", error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


app.get('/get-template-data', async (req, res) => {
    try {
        const apiUrl =
        "https://internship-marian.chili-publish-sandbox.online/grafx/api/v1/environment/internship-marian/templates?limit=10&sortBy=name&sortOrder=asc";
        const resp = await axios.get(apiUrl, {
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${authToken}`,
        },

        });

        if (!resp.data || !resp.data.data) {
            throw new Error('Failed to fetch image data.');
        }
        res.send(resp.data);
    } catch (error) {
        console.error("Error fetching template data:", error);
        res.status(500).json({ error: 'Something went wrong' });


    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

