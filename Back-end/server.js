    const express = require('express');
    const axios = require('axios');
    require('dotenv').config();
    const cors = require('cors');

    const app = express();
    const PORT = 3000;

    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
 
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
    

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });