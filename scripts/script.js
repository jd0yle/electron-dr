// for inspiration, when I have time: https://github.com/WarlockFE/warlock2/wiki/Javascript-Scripting

const { parentPort: connection } = require('worker_threads')
let globals = {};
const send = command => connection.postMessage(command)
/*const send = function (command) {
  connection.postMessage("#echo " + text)
  connection.postMessage(command)
}*/
const echo = text => send("#echo " + text);

const sendCommand = function (command) {
  echo(command);
  send(command);
}

// const forever = () => new Promise(r => setInterval(() => {}, 1000));
const sleep = seconds => new Promise(r => setTimeout(() => r(), seconds * 1000))
const globalHasVal = (xmlVar, value) => new Promise((res, rej) => {
  let interval = setInterval(() => {
    if (globals[xmlVar] === value) {
      clearInterval(interval);
      return res()
    }
  }, 25)
})

const scriptGlobals = {
  textFound: false,
  regex: null
};

const rt = () => new Promise(async (res, rej) => {
  await sleep(1)
  let interval = setInterval(() => {
    if (globals["roundTime"] <= 0) {
      clearInterval(interval)
      return res()
    }
    console.log('rt:', globals["roundTime"])
  }, 25)
})
const move = moveCommand => new Promise(async res => {
  const startRoomDesc = globals["room"]["description"]
  send(moveCommand)
  let interval = setInterval(() => {
    const newRoomDesc = globals["room"]["description"]
    if (startRoomDesc !== newRoomDesc) {
      clearInterval(interval)
      return res()
    }
  }, 5)
})

const globalsLoaded = () => new Promise(res => {
  let interval = setInterval(() => {
    if (globals["roundTime"] !== undefined) {
      clearInterval(interval)
      return res()
    }
  }, 1)
})

const waitFor = (regex) => new Promise(
  res => {
    scriptGlobals.textFound = false;
    scriptGlobals.waitForRegex = regex;
    let waitForInterval = setInterval(() => {
      console.log('interval checking...', scriptGlobals.textFound)
      if (scriptGlobals.textFound === true) {
        clearInterval(waitForInterval)
        scriptGlobals.waitForRegex = null;
        // could even return match here
        return res()
      }
    }, 500)
  }
);


async function script() {
  await globalsLoaded()
  //await waitFor(/Roundtime/)
  sendCommand("mind")
  await sleep(3)
  // await southToXing()
  // await northFromXing()

   sendCommand("forage")
   await sleep(.5)
   await rt()
   send("forage")
  await sleep(.5)
   await rt()
  echo("*** SCRIPT EXITING ***")
  // await globalHasVal("roundTime", 0)
  process.exit(0)
}

connection.on('message', message => {
  const { event } = message
  if (event === "text") {
    const { text } = message
    return parseText(text)
  }
  // { event: "xml", xmlVar, detail, globals }
  if (event === "xml") {
    const { xmlVar, detail = "", globals } = message
    return parseXML(xmlVar, detail, globals)
  }
  if (event === "control") {
    const { command } = message;
    if (command === "#abort") return process.exit(0); // this doesn't really unload it?
    else console.error("Unknown script command received:", command);
  }
  console.log('unhandled event to script:', event)
})

function parseText(text) {
  console.log('parsing text:', text.substring(0, 15) + "...")
  // if (!text) return;
  if (/*scriptGlobals.regex &&*/ text.match(/Roundtime/)) { // scriptGlobals.regex
    console.log('****** match found *********', scriptGlobals.regex)
    scriptGlobals.textFound = true
  }
  if (text.includes("Obvious paths:")) {
    moved = true; // todo: do this in xml
  }
}

function parseXML(xmlVar, detail, gameGlobals) {
  if (xmlVar === 'all') {
    Object.keys(gameGlobals).forEach(key => {
      globals[key] = gameGlobals[key]
    })
    return
  }
  globals[xmlVar] = gameGlobals[xmlVar]
  // console.log('xmlVar:', xmlVar);
  // don't want to reassign the variable:

  // in theory, if I synced globals at start I'd only need to update the changed variable with the detail
  // globals = gameGlobals; // assign local obj here to values from game
  // console.log('globals:', globals);
}

script();

// script received message: {
//   event: 'text',
//   value: '<output class="mono"/>\r\n' +
//     '\r\n' +

// script received message: {
//   event: 'xml',
//   variable: 'gameTime',
//   detail: '',
//   globals: {
//     connected: false,
//     bodyPosition: '',
//     exp: {},
//     room: {
//       name: '',
//       description: '',
//       items: [],

function southToXing() {
  return new Promise(async res => {
    await move("southwest")
    await move("southwest")
    await move("west")
    await move("west")
    await move("south")
    await move("southwest")
    await move("south")
    await move("south")
    await move("west")
    await move("west")
    await move("south")
    await move("southeast")
    await move("southeast")
    await move("go town gate")
    await move("southwest")
    await move("south")
    await move("go town gate")
    await move("southwest")
    await move("south")
    await move("south")
    await move("south")
    await move("south")
    await move("south")
    await move("south")
    await move("west")
    await move("west")
    await move("west")
    await move("southwest")
    await move("southwest")
    await move("southwest")
    await move("south")
    await move("south")
    await move("south")
    await move("southeast")
    await move("southeast")
    await move("south")
    await move("south")
    await move("southeast")
    await move("southwest")
    await move("south")
    await move("south")
    await move("southeast")
    await move("southeast")
    await move("south")
    await move("southwest")
    await move("southwest")
    await move("south")
    await move("south")
    await move("south")
    return res()
  })
}

function northFromXing() {
  return new Promise(async res => {
    await move("north")
    await move("north")
    await move("north")
    await move("northeast")
    await move("northeast")
    await move("north")
    await move("northwest")
    await move("northwest")
    await move("north")
    await move("north")
    await move("northeast")
    await move("northwest")
    await move("north")
    await move("north")
    await move("northwest")
    await move("northwest")
    await move("north")
    await move("north")
    await move("north")
    await move("northeast")
    await move("northeast")
    await move("northeast")
    await move("east")
    await move("east")
    await move("east")
    await move("north")
    await move("north")
    await move("north")
    await move("north")
    await move("north")
    await move("north")
    await move("northeast")
    await move("go town gate")
    await move("north")
    await move("northeast")
    await move("go town gate")
    await move("northwest")
    await move("northwest")
    await move("north")
    await move("east")
    await move("east")
    await move("north")
    await move("north")
    await move("northeast")
    await move("north")
    await move("east")
    await move("east")
    await move("northeast")
    await move("northeast")
    return res()
  })
}