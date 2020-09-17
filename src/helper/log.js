
function error(msg, code) {
    console.error(`error ${code}: ${msg}`);
    
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