#RexSyncServer

This repository hosts the express/socket.io server that syncs HTML5 videos between clients.
Since our primary deployment target is Heroku, the Procfile needed for it is included and can easily be deployed onto your own Heroku instance.

See the "appPage.html" for a minimal implementation / debug page you can use for the sync server. 

The way it works is that someone will create a "room" to watch a video together, then others can join that room using a generated link.
All events such as seeking, play/pause will be broadcasted to all users in the room, thus providing a synchronized watching experience.
