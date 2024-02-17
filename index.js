const { Relay } = require('frog-protocol');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

fs.mkdirSync("packets", { recursive: true })

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
    const packet = {
      name,
      params,
    };

    let packetJson
    try {
      packetJson = JSON.stringify(packet);
    } catch (error) {
      return;
    }
    const timestamp = Date.now();
    const filename = `${name}_${timestamp}.json`;
    const filePath = path.join(__dirname, "packets", filename);

    fs.writeFileSync(filePath, packetJson);
    console.log('%o', packetJson)
  });
});
