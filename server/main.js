const WebSocket = require('ws');
const net = require('net');
const express = require('express');
const cors = require('cors');
const { extractDateFromTradingSymbol, extractTradingNameFromSymbol, extractOptionTypeFromSymbol, extractStrikePriceFromSymbol, unixTimestampToDate } = require('./utils');
const bs = require('black-scholes');



const serverIP = 'localhost'; // Replace with the actual IP address of the TCP server
const serverPort = 8080; // Replace with the actual port number of the TCP server
const proxyPort = 3000; // Replace with the desired port number for the WebSocket proxy
const batchSize = 100; // Number of updates to be batched together
const batchInterval = 10000; // Time interval in milliseconds to wait for batching updates

const app = express();
app.use(cors());

const server = app.listen(proxyPort, () => {
  console.log(`WebSocket proxy server listening on port ${proxyPort}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  const tcpSocket = new net.Socket();

  // Connect to the TCP server
  tcpSocket.connect(serverPort, serverIP, () => {
    console.log('Connected to TCP server');
    // Send initial request packet
    const request = Buffer.alloc(1, 1);
    tcpSocket.write(request);
  });

  let batchedData = [];

  // Function to send batched data to the WebSocket client
  const sendBatchedData = () => {
    if (batchedData.length > 0) {
      ws.send(JSON.stringify(batchedData));
      batchedData = []; // Clear the batchedData array after sending
    }
  };

  let batchTimeout;
  

  tcpSocket.on('data', (data) => {
   
    const packetLength = data.readInt32LE(0);
    const tradingSymbol = data.toString('utf8', 4, 34).replace(/\0+$/, '');
    const sequenceNumber = data.readBigInt64LE(34);
    const timestamp = data.readBigInt64LE(42);
    const lastTradedPrice = data.readBigInt64LE(50);
    const lastTradedQuantity = data.readBigInt64LE(58);
    const volume = data.readBigInt64LE(66);
    const bidPrice = data.readBigInt64LE(74);
    const bidQuantity = data.readBigInt64LE(82);
    const askPrice = (data.readBigInt64LE(90));
    const askQuantity = data.readBigInt64LE(98);
    const openInterest = data.readBigInt64LE(106);
    const previousClosePrice = data.readBigInt64LE(114);
    const previousOpenInterest = data.readBigInt64LE(122);

    const marketData = {
      packetLength,
      tradingSymbol,
      sequenceNumber: sequenceNumber.toString(),
      timestamp: timestamp.toString(),
      lastTradedPrice: (lastTradedPrice.toString()/100).toFixed(2),
      lastTradedQuantity: lastTradedQuantity.toString(),
      volume: volume.toString(),
      bidPrice: (bidPrice.toString()/100).toFixed(2),
      bidQuantity: bidQuantity.toString(),
      askPrice: (askPrice.toString()/100).toFixed(2),
      askQuantity: (askQuantity.toString()/1).toFixed(2),
      openInterest: (openInterest.toString()/100).toFixed(2),
      previousClosePrice: (previousClosePrice.toString()/100).toFixed(2),
      previousOpenInterest: (previousOpenInterest.toString()/100).toFixed(2)
    };

    const expiryDate = extractDateFromTradingSymbol(tradingSymbol);
    const tradingName = extractTradingNameFromSymbol(tradingSymbol);
    const OptionType = extractOptionTypeFromSymbol(tradingSymbol);
    const strikePrice = (extractStrikePriceFromSymbol(tradingSymbol)/1).toFixed(2);
    const r= 0.05;

    const expiryTimestamp = new Date(expiryDate);
    const currentTimestamp = new Date().getTime();
    const timeToMaturity = (expiryTimestamp - currentTimestamp) / ( 252* 24 * 60 * 60 * 1000);

  

    const impliedVolatility = bs.blackScholes(parseFloat(marketData.lastTradedPrice)/100, parseFloat(strikePrice/100), timeToMaturity, 0.0002, r, OptionType === 'Calls' ? 'call' : 'put');// paise to ruppee
    const change = ((marketData.lastTradedPrice - marketData.previousClosePrice)/100).toFixed(2);
    const coi = ((marketData.bidPrice - marketData.askPrice)).toFixed(2);

    // Add the marketData object to the batchedData array
    batchedData.push({
      ...marketData,
      expiryDate,
      tradingName,
      OptionType,
      strikePrice,
      change,
      coi,
      timeToMaturity,
      impliedVolatility: parseFloat(impliedVolatility).toFixed(2)
    });

    

    // Check if the batch size has been reached
    if (batchedData.length >= batchSize) {
      // Send the batched data immediately
      sendBatchedData();
    } else {
      // Schedule sending the batched data after the batchInterval
      clearTimeout(batchTimeout);
      batchTimeout = setTimeout(sendBatchedData, batchInterval);
    }
  });

  // Handle errors and close connections
  tcpSocket.on('error', (error) => {
    console.error('TCP socket error:', error);
    ws.close();
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    tcpSocket.destroy();
  });
});
