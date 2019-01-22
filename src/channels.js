module.exports = function(app) {
  if(typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on('connection', connection => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection);
  });

  // As no authentication - publish to everyone 
  // Without time constraints I would've added a service for users to 'join' or 'leave' a room, and published events just to that room to prevent sending unnecessary events 
  app.publish(() => {
    return app.channel('anonymous');
  });

};
