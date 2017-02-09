### Xandem Bridge ###
This is a system that is designed to work with Xandem motion sensors (http://xandem.com/) and a smarthome brige that is programmable (such as SmartThings for example).
Xandem bridge will keep up to date with motion provide by Xandem motion sensors and notify your smarthome brige only when room occupancy changes are detected.
Multiple devices can subscribe to Xandem Bridge to receive these notifications

**Getting Started**
 * Get set up with Xandem motion sensors
 * Copy and rename the configexample.js file to just config.js
 * Set your xandem host and API key in the config.js file
 * Also in the config.js file, set up all of your rooms (copying the values from the drawing tool that Xandem provides will help. One unit is one foot and all parts of all rooms must be between -50 and 50 on both the X and Y axis)
 * Do an npm install and then bower install from the client direcotry
 
 ```
 	npm install && cd client/ && bower install && cd ../
 ```

**Running the system**
```
node index.js
```
 * By default the application will be running on port 3000 (this can be changed in config.js once you create it)
 * Whichever device (ex SmartThings) that you want to receive motion updates at will have to subscripe to Xandem Bridge. Do this By:
  * Have the device make a POST request to /api/register
  * Include in the headers Content-Type: application/json
  * Include in the body the ip address and port you would like to recieve  updates at in JSON format. For exmaple (use your device's address):
  ```
  {"ip": "192.168.1.2","port": "80"}
  ```
You will then receive updates at that address on that port whenever there are changes in room occupancy.

To help with debugging there is a UI you can use to view the motion that Xandem Bridge is picking up from the Xandem API.
You can go to http://localhost:3000/ or whichever IP address you are running Xandem Bridge from.

Additionally you can request a list of rooms from /api/rooms
