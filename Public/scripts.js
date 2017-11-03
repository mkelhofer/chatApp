// console.log('Sanity Check');

$(document).ready(()=>{
	// set up the route to piggyback on
	var socketURL = 'http://127.0.0.1:8080';
	var socketio = io.connect(socketURL);

	var name = prompt('What is your name?');
	// take the user's name and send it to the server 
	// ⬇︎⬇︎
	// emit takes 2 args:
	// 1. event (we make this up)
	// 2. data to send via ws
	socketio.emit('nameToServer', name);
	socketio.on('newUser', (users)=>{
		// console.log(`${userName} just joined`);
		// $('#users').append(`<div class="col-sm-12">${userName}</div>`)
		var usersHTML = "<h4>Connected Users</h4>"
		users.map((user)=>{
			if(user.name == name){
				usersHTML += `<div class="col-sm-12">${user.name} <span class="font-italic">(me)</span></div>`
				if(user == users[users.length-1]){
					$('#messages').append(`<div class="row justify-content-center"><div class="col-sm-auto date-bubble">${dateParse(user.time)}</div></div>`)
				}
			}else{
				usersHTML += `<div class="col-sm-12">${user.name}</div>`
				if(user == users[users.length-1]){
					$('#messages').append(`<div class="row justify-content-center"><div class="col-sm-auto alert-bubble">${user.name} joined chat</div></div>`)
				}
			}	
		});
		$('#users').html(usersHTML);

	});
		socketio.on('removeUser', (usersUpdate)=>{
		// console.log(`${userName} just joined`);
		// $('#users').append(`<div class="col-sm-12">${userName}</div>`)
		var usersHTML = "<h4>Connected Users</h4>"
		usersUpdate.users.map((user)=>{
			if(user.name == name){
				usersHTML += `<div class="col-sm-12">${user.name} (me)</div>`
			}else{
				usersHTML += `<div class="col-sm-12">${user.name}</div>`
			}	
		});
		$('#users').html(usersHTML);
		$('#messages').append(`<div class="row justify-content-center"><div class="col-sm-auto alert-bubble">${usersUpdate.userWhoLeft.name} left chat</div></div>`)


	});

	// Use jQuery to listen for form submit
	$('#submit-message').submit((event)=>{
		// stop page from submitting
		event.preventDefault();
		// get value from the input box
		var newMessage = $('#new-message').val();
		// use socketio to send data to the server
		socketio.emit('messageToServer',{
			name: name,
			message: newMessage,
			time: new Date()
		});
		$('#new-message').val('');
	});
	socketio.on('messageToClient', (messageObject)=>{
		if(messageObject.name != name){
			$('#messages').append(`<div class="row"><div class="col-sm-auto message-bubble">
				<h6 style=${nameColor(messageObject.name)}>${messageObject.name}</h6><p>${messageObject.message}
				<span class="invisible">xx${timeParse(messageObject.time)}</span>
				<span class="timestamp">${timeParse(messageObject.time)}</span></p></div></div>`)
		}else{
			$('#messages').append(`<div class="row justify-content-end">
				<div class="col-sm-auto message-bubble-self"><p>${messageObject.message}
				<span class="invisible">xx${timeParse(messageObject.time)}</span>
				<span class="timestamp">${timeParse(messageObject.time)}</span></p></div></div>`)
		}
		
	})

	function timeParse(dateString){
		var d = new Date(dateString);
		console.log(d)
		var hours24 = d.getHours();
		var minutes = d.getMinutes();
		if(minutes<10){
			minutes = `0${minutes}`;
		}
		if(hours24 < 12){
			if(hours24 == 0){
				return `12:${minutes} AM`
			}else{
				return `${hours24}:${minutes} AM`
			}
		}else{
			if(hours24 == 12){
				return `${hours24}:${minutes} PM`
			}else{
				return `${hours24-12}:${minutes} PM`
			}
		}
	}
	function dateParse(dateString){
		console.log(dateString);
		var d = new Date(dateString);
		console.log(d)
		var monthAsString= ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		return `${monthAsString[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
	}
	// function nameColor(name){
	// 	for(let i=0; i<users.)
	// }
});