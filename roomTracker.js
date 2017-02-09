
var config = require('./config');
var _ = require('underscore');

module.exports = {
	getOccupiedRooms: function(motionCoordinates){
		var occupiedRooms = [];
		var rooms = config.ROOMS;
		_.each(motionCoordinates, function(coord){
			var x = coord[0],
				y = coord[1];
			for(var i in rooms){
				if(x<rooms[i].xMax && x>rooms[i].xMin && y<rooms[i].yMax && y>rooms[i].yMin){
					occupiedRooms.push(rooms[i]);
				}
			}
		});
		return occupiedRooms;
	}
};