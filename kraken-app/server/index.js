const axios = require("axios");

const express = require("express");
const app = express();

const cors = require('cors');
app.use(cors());

const toKrakenRequest = async (endpoint, pair) => {
    
    try {

            let publicEndpoint = endpoint ? endpoint : "Ticker";
            let publicInputParameters = pair ? "pair="+pair : "pair=ethusd";

            if(endpoint==='Assets'){
                publicInputParameters=''
            }

            /*
            OTHER ENDPOINTS
            
            let publicEndpoint = "SystemStatus";
            let publicInputParameters = "";
            
            let publicEndpoint = "OHLC";
            let publicInputParameters = "pair=XXBTZUSD,XETHXXBT";

            let publicEndpoint = "AssetPairs";
            let publicInputParameters = pair ? "pair="+pair : "pair=ethusd,xbtusd";
 
            let publicEndpoint = "Trades";
            let publicInputParameters = "pair=ethusd&since=0";
            */

            const publicResponse = await QueryPublicEndpoint(publicEndpoint, publicInputParameters);
            return publicResponse

    }
    catch (e) {
        console.log();
        console.log("AN EXCEPTION OCCURED :(");
        console.log(e);
        return e
    }


    async function QueryPublicEndpoint(endPointName, inputParameters) {
        const baseDomain = "https://api.kraken.com";
        const publicPath = "/0/public/";
        const apiEndpointFullURL = baseDomain + publicPath + endPointName + "?" + inputParameters;
        
        const jsonData = await axios.get(apiEndpointFullURL);
        return jsonData.data.result;
    }

};

app.get("/currencypair", async (req, res) => {
const publicResponse = await toKrakenRequest("Ticker", req.query.pair);
res.json(publicResponse)
});

app.get("/assets", async (req, res) => {
const publicResponse = await toKrakenRequest("Assets", '');
res.json(publicResponse)
});

app.get("/", async (req, res) => {
const publicResponse = await toKrakenRequest("SystemStatus");
res.json(publicResponse)
});

const PORT = 3001;

app.listen(PORT, () => {
   console.log(`Server is running on PORT: ${PORT}`);
});