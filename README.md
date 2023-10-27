# Echo
This is a real time Chat Appliaction.

You need Visual studio Code to run the application.

To run this application in your local environment first you need to install node/NPM. Here's the process to install Node/NPM below.

How to Install Node.js and NPM on Windows?

Step 1: Download the Installer
Download the Windows Installer from NodeJs official website (https://nodejs.org/en/download). Make sure you have downloaded the latest version of NodeJs. It includes the NPM package manager.
Here, we are choosing the 64-bit version of the Node.js installer. The LTS (Long-term Support) version is highly recommended for you. After the download of the installer package, install it with a double-click on it. Now .msi file will be downloaded to your browser. Choose the desired location for that. <br>

Step 2: Install Node.js and NPM
just click next and next (by default), and thing will get downloaded.
The following features will be installed by default:
    Node.js runtime <br>
    Npm package manager <br>
    Online documentation shortcuts <br>
    Add to Path <br>

Step 3: Check Node.js and NPM Version
If you have a doubt whether you have installed everything correctly or not, let’s verify it with “Command Prompt”. <br>
To confirm Node installation, type node -v command. <br>
To confirm NPM installation, type npm -v command. <br>

Now if you want to run this code Just clone it.

After cloning it. the application's name is Echo. Its as 2 parts. Server and echo-client. Now in both places  you need to install some packages.

open the application in your visual studio code. then open terminal. it will show a path like -> F:\your path name\Echo <br>
then cd to server -> cd server. it will show F:\your path name\Echo\server>
<br>
here give the commands - <br>
  npm init -y <br>
  npm i express mongoose nodemon <br>
  npm i jsonwebtoken <br>
  npm i cors <br>
  npm i socket.io <br>

now to run the server use command. <br>
  npm run dev <br>

now in the similar way  omen another terminal and cd to echo-client -> cd echo-client <br>
it will show F:\your path name\Echo\echo-client> <br>

use command<br>
  npm install <br>
  npm install mongodb-client <br>
  npm install socket-io-client <br>

now to run the echo-client(front-end) use command. <br>
  npm run start 




