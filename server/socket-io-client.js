const io = require('socket.io-client');

const serverURL = 'http://localhost:8080'; // Replace with the actual URL of the server

const socket = io(serverURL);

socket.on('connect', () => {
  console.log('Connected to server');
  
  // Send initial request packet
  const request = Buffer.alloc(1, 1);
  socket.emit('request', request);
});

socket.on('data', (data) => {
  // Process the received data
  const packetLength = data.readInt32LE(0);
  // ... Extract other fields from the data packet

  const marketData = {
    packetLength,
    // ... Assign other extracted fields
  };

  console.log('--- Received Market Data ---');
  console.log(JSON.stringify(marketData, null, 2));
  console.log('-----------------------------');
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});
