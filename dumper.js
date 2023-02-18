let args = process.argv.toString().split(',')

const { Relay } = require('bedrock-protocol')
const relay = new Relay({
  version: args[2],
  host: args[3],
  port: parseInt(args[4]),
  destination: {
    host: args[5],
    port: parseInt(args[6]),
  }
})
relay.listen()

relay.on('connect', player => {
  player.on('clientbound', ({ name, params }) => {
    if (name === 'move_entity' || name === 'set_entity_data' || name === 'level_event') return
    console.log('[info] ' + name + ' ' + '%o', params)
  })
})
