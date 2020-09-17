
function error(msg, code, debugError) {
    console.error(`error ${code}: ${msg}`);
    
    if (debugError) {
        console.error(`debug: ${debugError}`);
    }

    // TODO: log to file
}

function message(msg, code) {
    console.error(`error ${code}: ${msg}`);

    // TODO: log to file
}

module.exports = {
    error,
    message
}