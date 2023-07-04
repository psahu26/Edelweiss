

# Edelweiss

This project involves creating a WebSocket server that enables real-time communication between clients and the server. To run this WebSocket server, you'll need to have Node.js and npm installed on your machine. Additionally, we'll be using nodemon to automatically restart the server whenever there are changes to the code. If you don't have nodemon installed, make sure to install it by running the following command:
`npm install`

`npm install nodemon`


Running the WebSocket Server
To run the WebSocket server and start the real-time communication, use the following command:


`npx nodemon ./main.js`


Java Component
Apart from the WebSocket server, this project also includes a Java component. The Java component involves running a Java program with specific configurations. Before running the Java program, ensure you have Java installed on your system.

To run the Java program, use the following command:

`java -Ddebug=true -Dspeed=2.0 -classpath ./feed-play-1.0.jar hackathon.player.Main dataset.csv 8080`


Please note that the command has several flags and arguments, and you can adjust the values as needed for your use case.

React App
In addition to the WebSocket server and the Java component, this project also contains a React app. To run the React app, you'll need to have Node.js and npm installed on your machine (if you haven't installed them already).

To start the React app, use the following command:

```
npm run dev
```
