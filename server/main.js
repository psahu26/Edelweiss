const WebSocket = require('ws');
const net = require('net');
const express = require('express');
const cors = require('cors');
const { extractDateFromTradingSymbol, extractTradingNameFromSymbol, extractOptionTypeFromSymbol, extractStrikePriceFromSymbol } = require('./utils');
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
    // Process the received data
    const packetLength = data.readInt32LE(0);
    const tradingSymbol = data.toString('utf8', 4, 34).replace(/\0+$/, '');
    const sequenceNumber = data.readBigInt64LE(34);
    const timestamp = data.readBigInt64LE(42);
    const lastTradedPrice = data.readBigInt64LE(50);
    const lastTradedQuantity = data.readBigInt64LE(58);
    const volume = data.readBigInt64LE(66);
    const bidPrice = data.readBigInt64LE(74);
    const bidQuantity = data.readBigInt64LE(82);
    const askPrice = data.readBigInt64LE(90);
    const askQuantity = data.readBigInt64LE(98);
    const openInterest = data.readBigInt64LE(106);
    const previousClosePrice = data.readBigInt64LE(114);
    const previousOpenInterest = data.readBigInt64LE(122);

    const marketData = {
      packetLength,
      tradingSymbol,
      sequenceNumber: sequenceNumber.toString(),
      timestamp: timestamp.toString(),
      lastTradedPrice: lastTradedPrice.toString(),
      lastTradedQuantity: lastTradedQuantity.toString(),
      volume: volume.toString(),
      bidPrice: bidPrice.toString(),
      bidQuantity: bidQuantity.toString(),
      askPrice: askPrice.toString(),
      askQuantity: askQuantity.toString(),
      openInterest: openInterest.toString(),
      previousClosePrice: previousClosePrice.toString(),
      previousOpenInterest: previousOpenInterest.toString()
    };

    const expiryDate = extractDateFromTradingSymbol(tradingSymbol);
    const tradingName = extractTradingNameFromSymbol(tradingSymbol);
    const OptionType = extractOptionTypeFromSymbol(tradingSymbol);
    const strikePrice = extractStrikePriceFromSymbol(tradingSymbol);

    const expiryTimestamp = new Date(expiryDate);
    const currentTimestamp = new Date().getTime();
    const timeToMaturity = (expiryTimestamp - currentTimestamp) / (252 * 24 * 60 * 60 * 1000);

    // Using the Black-Scholes formula to calculate Implied Volatility
    // const impliedVolatility = bs.blackScholes(
    //   marketData.lastTradedPrice / 100, // Convert from paise to rupees
    //   strikePrice / 100, // Convert from paise to rupees
    //   timeToMaturity,
    //   0.2,
    //   0.05,
    //   OptionType === 'Calls' ? 'call' : 'put', // Assuming OptionType is either 'Calls' or 'Puts'
    //   // optionPrice: marketData.lastTradedPrice / 100, // Convert from paise to rupees
    // );

    const impliedVolatility = bs.blackScholes(marketData.lastTradedPrice / 100, strikePrice / 100, timeToMaturity, 0.2, .05, OptionType === 'Calls' ? 'call' : 'put');

    const change = marketData.lastTradedPrice - marketData.previousClosePrice;
    const coi = marketData.bidPrice - marketData.askPrice;
    // Add the marketData object to the batchedData array
    batchedData.push({
      ...marketData,
      expiryDate,
      tradingName,
      OptionType,
      strikePrice,
      change,
      coi,
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
