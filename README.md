# Basic integration example of SDK usage

This basic example shows how simple it is to make a TypeScript integration, as well as using the SDK via NPM instead of a script.

## How to run

### Installing Node
We will be using [Node.js](https://nodejs.org/) and using the Node Package Manager (npm) to install [Parcel] If you do not have Node installed on your system you can install it at the website above, this will also install the Node Package Manager.

Now we can install the two packages we need.

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

### Creating the base files
So now that we have our dependency packages installed we can start.

We will start our website with this command by navigating to our directory in our terminal and running
```sh
npx parcel src/index.html
```

Now, enjoy the graphical editor!