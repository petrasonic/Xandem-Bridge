
var config = require('./config');
var _ = require('underscore');

function onSegment(p,q,r){
        return q.x <= Math.max(p.x,r.x) && q.x >= Math.min(p.x,r.x) && q.y <= Math.max(p.y,r.y) && q.y >= Math.min(p.y,r.y);
}

function orientation(p,q,r){
        var val = (q.y - p.y)*(r.x - q.x)-(q.x - p.x)*(r.y - q.y);
        if (val == 0){
                return 0;
        }
        return (val > 0)?1:2;
}

function mathToFigureOutIfShitsBeenCrossed(p1,q1,p2,q2){
        var o1 = orientation(p1, q1, p2);
        var o2 = orientation(p1, q1, q2);
        var o3 = orientation(p2, q2, p1);
        var o4 = orientation(p2, q2, q1);

        if ( o1 != o2 && o3 != o4 ){
                return true;
        }
        
        if ( o1 == 0 && onSegment(p1, p2, q1)){ return true; } 
        if ( o2 == 0 && onSegment(p1, q2, q1)){ return true; } 
        if ( o3 == 0 && onSegment(p2, p1, q2)){ return true; } 
        if ( o4 == 0 && onSegment(p2, q1, q2)){ return true; }
        return false; 
}

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
	},
        getCrossedBoundaries: function(line){
                var crossedBoundaries = [];
                var boundaries = config.BOUNDARIES;
                _.each(boundaries, function(boundary){
                        var p1 = {x:boundary.x1,y:boundary.y1};
                        var q1 = {x:boundary.x2,y:boundary.y2};
                        var p2 = {x:line.x1,y:line.y1};
                        var q2 = {x:line.x2,y:line.y2};
                        if ( mathToFigureOutIfShitsBeenCrossed(p1,q1,p2,q2) ){
                                crossedBoundaries.push(boundary);
                        }                        
                });
                return crossedBoundaries;
        }
};
