// Alternative to startServer.js with pm2
// pm2 also works and can be used if license is ok https://github.com/Unitech/pm2/blob/master/LICENSE
var daemon = require("daemonize2").setup({
    main: "startServer.js",
    name: "Arrow Server",
    pidfile: "process.pid"
});

switch (process.argv[2]) {

    case "start":
        daemon.start();
        break;

    case "stop":
        daemon.stop();
        break;

    default:
        console.log("Usage: [start|stop]");
}
