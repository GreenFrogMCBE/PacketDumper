const { Relay } = require('frog-protocol')
const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)

// https://github.com/GreenFrogMCBE/Protocol/blob/master/src/datatypes/util.js#L34C1-L36C2
function serialize (obj = {}, fmt) {
  return JSON.stringify(obj, (k, v) => typeof v === 'bigint' ? v.toString() : v, fmt)
}

const relay = new Relay({
  version: args[0],
  host: args[1],
  port: parseInt(args[2]),
  destination: {
    host: args[3],
    port: parseInt(args[4]),
  }
})

relay.listen()

relay.on('connect', player => {
  player.on('clientbound', ({ name, params }) => {
    if (name === 'move_entity' || name === 'set_entity_data' || name === 'level_event') return

    const packet = {
      name,
      params,
    }

    const packet_json = JSON.stringify(serialize(packet))
    const timestamp = Date.now()
    const file_name = `${name}_${timestamp}.json`
    const file_path = path.join(__dirname, file_name)

    fs.writeFile(file_path, packet_json, err => {
      if (err) {
        console.error(err)
      }
    })
  })
})
