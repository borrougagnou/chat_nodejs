const fs	= require('fs');
const request	= require('request');
const app	= require('express')();
const http	= require('http').Server(app);
const io	= require('socket.io')(http);
const port	= 2086;

// chat template

app.get('/', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});


io.on('connection', function(socket){
	// refresh how many are watching every 5000 ms
	setInterval(function(){
		socket.emit('count', Object.keys(io.sockets.connected).length);
	}, 5000);

	// if a chat is received, push it to everyone
	socket.on('chat message', function(msg){
		console.log(msg);
		let username;
		if(msg.username !== "")
		{
			username = msg.username;
			io.emit('chat message',  {'msg': "<b>"+username+":</b> "+msg.msg,'count': Object.keys(io.sockets.connected).length });
		}
		/*
		if(msg.username === "")
		{
			username = "Guest";
		}
		else
		{
			username = msg.username;
		}
		io.emit('chat message',  {'msg': "<b>"+username+":</b> "+msg.msg,'count': Object.keys(io.sockets.connected).length });
*/
	});
});

//start app
http.listen(port, function(){
	console.log('listening on *:' + port);
});
