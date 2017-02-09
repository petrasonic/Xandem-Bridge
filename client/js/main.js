$(function(){
  $("#mainTitle").text('Xandem Bridge');
  var socket = io('/telem');

  socket.emit('add user',{});

  socket.on('newData', function(data) {
    data = JSON.parse(data);
    $("#coordinates").text(data.motion_coordinates);
    $("#score").text(data.motion_score);
    $("#occupiedRooms").text(_.pluck(data.rooms, 'name'));

    if(data.motion_coordinates!==null){
      var points = _.map(data.motion_coordinates, function(point){return {x:point[0],y:point[1],r:10};});
      myChart.data.datasets[0].data.splice(0, myChart.data.datasets[0].data.length);
      _.each(points, function(point){
        myChart.data.datasets[0].data.push(point);
      });
      myChart.update();
    }

  });

  var myChart = new Chart(document.getElementById("myChart"), {
    type: 'bubble',
    data: {
      datasets:[
        {
          label: 'Some Point',
          data: [
            {
              x: 0,
              y: 0,
              r: 1
            }
          ],
          backgroundColor:"#ff4000",
          hoverBackgroundColor: "#ff4000"
        }
      ]
    },
    options:{

      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            suggestedMin: -50,
            suggestedMax: 50,
          }
        }],
        xAxes: [{
          display: true,
          ticks: {
            suggestedMin: -50,
            suggestedMax: 50,
          }
        }]
      },
      // scaleOverride: true,
      scaleSteps: 5,
      annotation: {
        annotations: [],
        drawTime: 'afterDraw',

      }
    }
  });

  //get coordinates for rooms
  $.get("api/rooms", function(data){
    var rooms = [];
    _.each(data.rooms,function(room){
      room = _.defaults(room,{
        type: 'box',
        xScaleID: 'x-axis-0',
        yScaleID: 'y-axis-0',
        borderColor: '#FFF',
        backgroundColor: 'rgba(255,255,255,0)',
        borderWidth: 7
      });
      rooms.push(room);
    });
    myChart.options.annotation.annotations = rooms;

    //do autoscale
    var homeXMin = _.min(rooms, function(room){return room.xMin;}).xMin-1;
    var homeXMax = _.max(rooms, function(room){return room.xMax;}).xMax+1;
    var homeYMin = _.min(rooms, function(room){return room.yMin;}).yMin-1;
    var homeYMax = _.max(rooms, function(room){return room.yMax;}).yMax+1;
    myChart.options.scales.xAxes[0].ticks.suggestedMin = homeXMin;
    myChart.options.scales.xAxes[0].ticks.suggestedMax = homeXMax;
    myChart.options.scales.yAxes[0].ticks.suggestedMin = homeYMin;
    myChart.options.scales.yAxes[0].ticks.suggestedMax = homeYMax;

    myChart.update();
  });
});