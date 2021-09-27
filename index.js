//--------CONTSTANTS----------\\
const url = require('url'),
	path = require('path'),
	express = require('express'),
	session = require('express-session'),
	ejs = require('ejs'),
	fetch = require('node-fetch'),
	config = require('./config'),
	bodyParser = require('body-parser'),
	app = express(),
	MemoryStore = require('memorystore')(session),
	dataDir = path.resolve(`${process.cwd()}${path.sep}website`),
	templateDir = path.resolve(`${dataDir}${path.sep}pages`);
	



	//------------START------------\\
    console.log(
		`[INFO]: TRYING TO START WEBSITE`
	);
	console.log('-------------------------------------');

    try {
		const domainUrl = new URL(config.website.protocol + config.website.domain);
		domain = {
			host: domainUrl.hostname,
			protocol: domainUrl.protocol
		};
	} catch (e) {
		console.log(e);
		throw new TypeError(
			'[ERROR]: Invalid domain Specified in the config file.'
		);
	}


    app.use(
		session({
			store: new MemoryStore({ checkPeriod: 86400000 }),
			secret:
				config.website.cookieSecret,
			resave: false,
			saveUninitialized: false
		})
	);

    app.use(bodyParser.json());
	app.use(
		bodyParser.urlencoded({
			extended: true
		})
	);

    app.engine('html', ejs.renderFile);
	app.set('view engine', 'html');

    app.use('/', express.static(path.resolve(`${dataDir}${path.sep}/`)));

    

    //------------------FUNCTION-----------\\
	function render(res, req, template, data = {}) {
		const baseData = {
			logo: config.bot.logo,
			name: config.bot.name,
			description: config.bot.description,
      img1: config.img.img1,
      img2: config.img.img2,
      feature1: config.bot.feature1.main,
      feature1d: config.bot.feature1.description,
      feature2d: config.bot.feature2.main,
      feature2: config.bot.feature2.description,
      feature3: config.bot.feature3.main,
      feature3d: config.bot.feature2.description,
		};
		res.render(
			path.resolve(`${templateDir}${path.sep}${template}`),
			Object.assign(baseData, data)
		);
	}

    //----------RENDER PAGES-----------\\
if (config.showStats) {
  const Discord = require('discord.js')
  const client = new Discord.Client({
    shards: "auto",
   
    allowedMentions: {
      parse: [ ],
      repliedUser: false,
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
   intents: [],
});

  app.get('/', (req, res) => {
		render(res, req, 'stats-index.ejs', {
      guilds: client.guilds.cache.size,
      users: client.guilds.cache.reduce((c, g) => c + g.memberCount, 0)
    });
	});

  client.login(config.bot.token)

} else {
    app.get('/', (req, res) => {
		render(res, req, 'normal-index.ejs');
	});
}





	app.get('/discord', (req, res) => {
		res.redirect(config.bot.support)
	})

  app.get('/dc', (req, res) => {
		res.redirect(config.bot.support)
	})

	app.get('/invite', (req, res) => {

		res.redirect(config.bot.invite)
	})

  app.get('/vote', (req, res) => {

		res.redirect(config.bot.botlist)
	})

app.use(function(req, res) {
  res.status(404).sendFile(__dirname + '/website/pages/404.html');

	});

    //---------END----------\\
    app.listen(config.website.port, null, null, () =>
		console.log(`[INFO]: The Website is ready on port ${config.website.port}`)
	);

	let domainUrl = config.website.protocol + config.website.domain

    console.log(`[INFO]: Website is now live on ${domainUrl}`)
