const express = require('express');
const exphbs  = require('express-handlebars');
const path    = require('path');
const Log = require('./lib/Logger');

const app = express();
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const io = require('socket.io')(server);

const GithubWebhooks = require('./Github/webhooks');

const stopSignals = [
  'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
  'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
];
const PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
const IP = process.env.OPENSHIFT_NODEJS_IP || 'localhost';

Log.Socket(io);

let SocketReady = false;

require('./bot');

io.on('connection', socket => {
  if (SocketReady) return false;
  Log.Logger.debug('Socket.IO Connected!');
  SocketReady = true;
});
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home', {
    logs: Log.Logger.logs
  });
});

app.post('/', GithubWebhooks);

Log.Logger.info(`=> Starting app on ${IP || 'localhost'}:${PORT}`);


server.listen(PORT, IP, () => {
  Log.Logger.info(`=> Listening on ${IP || 'localhost'}:${PORT}`);
});
