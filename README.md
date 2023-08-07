# Basic integration example of SDK usage

This basic example shows how simple it is to make a Javascript integration, as well as using the SDK via NPM instead of a script.

## How to run

### Installing Node
We will be using [Node.js](https://nodejs.org/) and using the Node Package Manager (npm) to install Parcel. If you do not have Node installed on your system you can install it at the website above, this will also install the Node Package Manager.

Now we can install the packages we need.

##### Parcel
Parcel is a JavaScript bundler that also includes a local development web server. 

To install Parcel all we need to do is type this command
```sh
npm install -D parcel
```

##### GraFx Studio-SDK
The GraFx Studio-SDK is a package created by CHILI to make interacting with the Studio editor easy. 

To install the GraFx Studio-SDK you simple type this command
```sh
npm install @chili-publish/studio-sdk
```

#### Express 

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

To install Express you simple type this command
```sh
npm install express
```

#### Axios 

Axios is a promise based HTTP client for the browser and node.js

To install Axios you simple type this command
```sh
npm install axios
```
#### Dotenv

Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env

To install Dotenv you simple type this command
```sh
npm install dotenv
```


### Creating the base files
So now that we have our dependency packages installed :

Create an .env file in backend folder and add the following lines to it with your credentials from the CHILI Publisher portal.

```sh
CLIENT_ID = '...'
CLIENT_SECRET = '...'
```

We will start our website with these commands by navigating to our directory in our terminal and running express server then parcel server: 

```sh	
node backend/server.js
```

```sh
npx parcel src/index.html
```

Now, enjoy the graphical editor!