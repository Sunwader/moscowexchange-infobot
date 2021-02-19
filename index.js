require('dotenv').config()
const { Telegraf } = require('telegraf')
const { answersFromBot } = require('./answersFromBot');
const { TOKEN } = process.env;

const bot = new Telegraf(TOKEN);

bot.start( ( ctx ) => {
    return ctx.reply(`Привет, ${ctx.from.first_name}! Напиши мне тикер любой акции Московской биржи, а я выдам тебе ее текущую стоимость`);
} );

bot.on( 'text', ( ctx ) => {
    answersFromBot( ctx );
} );

bot.launch();
