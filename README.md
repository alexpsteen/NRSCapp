# NRSCapp

This is the mobile app for [Northern Roots Southern Charm](http://www.northernrootssoutherncharm.com).

## Release Notes for v1.0

### New Features

* feature 1
* feature 2

### Fixed Defects

* fixed 1
* fixed 2

### Known Defects

* known 1
* known 2

## Installation Guide

These are the required steps to run the project locally for development. For production the code is already deployed to Amazon Web Services. The web version is available on [Amazon Cloudfront CDN](https://d1sdroy3lf70co.cloudfront.net).

### Prerequisites

* Install [Node.js and npm](https://nodejs.org)
* Install Cordova and Ionic: `npm install -g cordova ionic`

### Code Download

* Check out the code repository from Github: `git clone https://github.com/alexpsteen/NRSCapp.git`
  * Change to the client directory in the new NRSCapp directory: `cd NRSCapp` followed by `cd client`
* OR download the master branch as a zip file and unzip it: [DOWNLOAD](https://github.com/alexpsteen/NRSCapp/archive/master.zip)
* Follow the next steps to obtain the aws-config.js file which will contain the info for all the AWS connections

### Obtain aws-config.js

1. Go to the [AWS Console](https://aws.amazon.com) and log in by clicking the button in the top right corner of the window:

![install 1](https://github.com/alexpsteen/NRSCapp/blob/master/media/install1.png "Install Step 1")

2. In the search bar type in "mobile hub" and select the Mobile Hub item in the results list:

![install 2](https://github.com/alexpsteen/NRSCapp/blob/master/media/install2.png "Install Step 2")

3. Select the nrsc-app tile by clicking on it:

![install 3](https://github.com/alexpsteen/NRSCapp/blob/master/media/install2.png "Install Step 3")

4. Select the Hosting and Streaming tile by clicking on it:

![install 4](https://github.com/alexpsteen/NRSCapp/blob/master/media/install2.png "Install Step 4")

5. Click on the Download aws-config.js file button and save the file:

![install 5](https://github.com/alexpsteen/NRSCapp/blob/master/media/install2.png "Install Step 5")

6. Move the aws-config.js file to the client/src/assets folder of the NRSCapp folder created earlier when downloading the code source.

### Run the Code

* Change to the client directory in the NRSCapp directory: `cd NRSCapp/client`
* Run npm install to get the required libraries: `npm install`
* Run the Ionic server: `ionic serve`

### Troubleshooting

Links to check if you run into problems with any of the prior steps:

* [Node.js](https://nodejs.org)
* [Ionic Framework](http://ionicframework.com)
* [Github](https://github.com)
* [Amazon Web Services](https://aws.amazon.com)