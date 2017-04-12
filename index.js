
'use strict';

var config = require('./config');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var server = app.listen(config.HOST_PORT);
var io = require('socket.io').listen(server);
var router = express.Router();
var _ = require('underscore');
var getmac = require('getmac');
var roomTracker = require('./roomTracker');

var subscribers = [];

app.use(express.static(__dirname + '/client'));
// app.use('/api/someaction/v1', require('./somefile.js'));

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/client/img/favicon.ico'));

console.log('listening on port: ',config.HOST_PORT);

/* Socket.io */
var numUsers = 0;
var nsp = io.of('/telem');
nsp.on('connection', function(socket){
	var addedUser = false;
	socket.on('add user', function (username){
		if(addedUser) return;

		++numUsers;
    	addedUser = true;
	});

	socket.on('disconnect', function(){
		if(addedUser)
			--numUsers;
	});
});

/* Poll for data */
var pollXandem = function(){
	var post_req = http.request({
		method: 'POST',
        host: config.XANDEM_HOST,
       	path: '/v1/data',
       	headers: {Authorization: config.XANDEM_API_KEY}
    }, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            var parsed = JSON.parse(body);
			parsed.rooms = roomTracker.getOccupiedRooms(parsed.motion_coordinates);
            sendDataToSubscribers(parsed);

            if(numUsers>0){
            	nsp.emit('newData', JSON.stringify(parsed));
            }

			setTimeout(pollXandem, config.XANDEM_POLLING_FREQUENCY);
        });

	});

	post_req.write(JSON.stringify({
		data_fields: ["motion_score", "motion_coordinates"]
	}));
	post_req.end();


	post_req.on('error', function(err) {
		console.error('Error with the request:', err.message);
	});

};
pollXandem();

var lastRoomsWithMotion = [];
function sendDataToSubscribers(data){
	//send only if different rooms are active
	if(_.isEqual(data.rooms, lastRoomsWithMotion)){
		return
	}else{
		lastRoomsWithMotion = data.rooms;
	}

	for(var i in subscribers){
		var post_req = http.request({
			method: 'POST',
	        host: subscribers[i].ip,
	        port: subscribers[i].port,
	       	path: subscribers[i].path,
	       	headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
	    }, function(response){});
		post_req.write(JSON.stringify(data));
		post_req.end();

		post_req.on('error', function(err) {
			console.error('Error with forwarding the data', err.message);
		});
	}
}

var interval = setInterval(function(){
	if(lastRoomsWithMotion.length > 0){
	        var data = {};
	        data.rooms = lastRoomsWithMotion;
		for(var i in subscribers){
			var post_req = http.request({
				method: 'POST',
		        	host: subscribers[i].ip,
		        	port: subscribers[i].port,
		       		path: subscribers[i].path,
		       		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
		    	}, function(response){});
			post_req.write(JSON.stringify(data));
			post_req.end();
	
			post_req.on('error', function(err) {
				console.error('Error with forwarding the data', err.message);
			});
		}
	}

},1000);

/* SSDP */
// var Server = require('node-ssdp').Server;
// var ssdpServer = new Server({
// 	// unicastHost: require('ip').address(),
// 	location: '/desc.xml',
// 	// ssdpPort: '3000',
// 	unicastBindPort: '3000',
// 	// deviceAddress: '3000'
// 	// ssdpIp: require('ip').address()
// 	// location: require('ip').address() + ':3000/desc.xml',
// 	// ssdpPort: 3000
// });

// // ssdpServer.addUSN('upnp:rootdevice')
// ssdpServer.addUSN('urn:schemas-upnp-org:device:XandemBridgeThang:1')
// // ssdpServer.addUSN('urn:schemas-upnp-org:service:ContentDirectory:1')
// // ssdpServer.addUSN('urn:schemas-upnp-org:service:ConnectionManager:1')
// ssdpServer.start(require('ip').address());

/* API */
app.use(bodyParser.json())

router.use(function(req, res, next) {
    // do logging
    // console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});
router.post('/register', function(req, res){
	var newSubscriber  = req.body.content;

	if(_.isEqual(newSubscriber,{})){
		var errorMessage = "Subscription request malformatted. The body was null";
		res.json({ message: errorMessage, subscriptionStatus: false });
		console.error(errorMessage);
		return;
	}

	if(!newSubscriber.ip){
		res.json({ message: 'Please specify an IP Address', subscriptionStatus: false });   
	}else if(!newSubscriber.port){
		res.json({ message: 'Please specify a Port', subscriptionStatus: false });   
	}else if(!newSubscriber.path){
		newSubscriber.path = '/';
	}
	if(_.findIndex(subscribers,newSubscriber)>=0){
		res.json({ message: 'You\'ve already subscribed. Don\'t ask me again!', subscriptionStatus: true });   
	}else{
		subscribers.push(newSubscriber);
		console.log('Subscribers: ',subscribers);
		res.json({ message: 'Hello There! welcome to the api!', subscriptionStatus: true });
	}
		
});

var macAddress;
getmac.getMac(function(err,_macAddress_){ macAddress = _macAddress_; });
router.get('/info', function(req, res){
	res.json({macAddress: macAddress});
});

router.get('/rooms', function(req, res){
	res.json({rooms: config.ROOMS});
});
app.use('/api', router);
