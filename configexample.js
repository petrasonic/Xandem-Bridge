/*
 * How To Use
 * 1) Copy this file and save as config.js
 * 2) Fill out the proper host and api key for your Xandem set up
 * 3) Set the rooms here by copying the same rooms that you have mapped out in the Xandem interface
 *    The values are the same as the coordinate system there where one unit is equal to one foot
 */
var config = {
	HOST_PORT:3000,
	XANDEM_HOST:'xandem-123.local',
	XANDEM_API_KEY: 'abc123=',
	XANDEM_POLLING_FREQUENCY: 2000,
	ROOMS: [
		{
			name: 'Living Room',
			xMin: -30,
            xMax: -12,
            yMax: -3,
            yMin:  -15
		},
		{
			name: 'Kitchen',
			xMin: -12,
            xMax: -4,
            yMax: -2,
            yMin:  -11
		},
		{
			name: 'Bedroom',
			xMin: -30,
            xMax: -15,
            yMax: 7,
            yMin:  -3
		},
		{
			name: 'Bedroom Closet',
			xMin: -15,
            xMax: -14,
            yMax: 7,
            yMin:  1
		},
		{
			name: 'Bathroom',
			xMin: -14,
            xMax: -5,
            yMax: 7,
            yMin:  1
		},
		{
			name: 'Front Closet',
			xMin: -5,
            xMax: 3,
            yMax: 7,
            yMin:  1
		},
		{
			name: 'Hallway',
			xMin: -15,
            xMax: 3,
            yMax: 1,
            yMin:  -2
		}
	]
};
module.exports = config;