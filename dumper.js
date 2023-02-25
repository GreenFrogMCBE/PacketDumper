const { Relay } = require('bedrock-protocol');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

const relay = new Relay({
  version: args[0],
  host: args[1],
  port: parseInt(args[2]),
  destination: {
    host: args[3],
    port: parseInt(args[4]),
  }
});

relay.listen();

relay.on('connect', player => {
  player.on('clientbound', ({ name, params }) => {
    if (name === 'move_entity' || name === 'set_entity_data' || name === 'level_event') return;
    const packet = {
      name,
      params,
    };
    const packetJson = JSON.stringify(packet);
    const timestamp = Date.now();
    const filename = `${name}_${timestamp}.json`;
    const filePath = path.join(__dirname, filename);
    fs.writeFile(filePath, packetJson, err => {
      if (err) {
        console.error(err);
      }
    });
  });
});
