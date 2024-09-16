const TelegramBot = require('node-telegram-bot-api');
const { Users } = require('./createTables');
const { UserCreate } = require('./Asists/User');
const { GetReferals } = require('./Asists/GetReferals');
const { MainMsg } = require('./Asists/MainMsg');

var token = "7392358864:AAFtccRPaUhgqfOfb6GpAS3W7b_x7BpFZL4"

const bot = new TelegramBot(token, { polling: true });

// Handle the /start command

var adminID = 5137539631

function generateRandomString() {
  let result = '';
  let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let length = 5; // The length of the string, e.g. 'a73' or '25g'

  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}



bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  var ReferalCode = parseInt(match[1]);

  var ReferalUser = await Users.findOne({
    where: {
      token: ReferalCode
    }
  })
  if (ReferalUser.toJSON().isVip == false) {
    ReferalCode = 5137539631
  }

  var res = await UserCreate(chatId, ReferalCode)
  if (res == true) {

    bot.sendMessage(chatId, "Salom " + msg.from.first_name + " Standart Coin jamosiga hush kelibsiz")
    bot.sendMessage(chatId, await MainMsg(msg.from.id))

    bot.sendMessage(ReferalCode, "Sizga obuna boldi: " + msg.from.first_name)
    bot.sendMessage(ReferalCode, await MainMsg(ReferalCode))
  } else if (res == false) {
    bot.sendMessage(chatId, await MainMsg(msg.from.id))
    bot.sendMessage(54235623, "SALOM")
  } else {
    bot.sendMessage(chatId, "Nimadir xato ketdi, keyinroq qayta urinib ko‘ring")
  }

});


bot.onText(/\/start$/, async (msg, match) => {
  const chatId = msg.chat.id;

  var res = await UserCreate(chatId, 5137539631)
  if (res == true) {

    bot.sendMessage(chatId, "Siz roʻyxatdan oʻtdingiz")
    bot.sendMessage(chatId, await MainMsg(msg.from.id))

  } else if (res == false) {
    bot.sendMessage(chatId, await MainMsg(msg.from.id))
  } else {
    bot.sendMessage(chatId, "Nimadir xato ketdi, keyinroq qayta urinib ko‘ring")
  }

});

bot.onText(/\/getvip/, async (msg, match) => {
  const chatId = msg.chat.id;
  var refreshID = generateRandomString()
  bot.sendMessage(adminID,
    `newID: ${refreshID},
userID: ${msg.from.id}`)

  bot.sendMessage(chatId, "Sizning waxsiy raqamizgiz: " + refreshID)
  bot.sendMessage(chatId, "@scoin_admin ga yozishingiz mumkin")
});


bot.on("text", async (msg) => {
  if (msg.from.id == adminID) {
    if (msg.text.split(" ")[0] == "givevip") {
      try {
        var newVIPID = parseInt(msg.text.split(" ")[1])
        var user = await Users.findOne({
          where: {
            token: newVIPID
          }
        })
        if (user) {
          var info = await Users.update(
            {
              isVip: true
            },
            {
              where: { token: newVIPID }
            }
          )
          if (info[0] == 0) {
            bot.sendMessage(adminID, "VIP STATUS berishda xatolik id: " + newVIPID + " topilmadi")
          } else if (info[0] == 1) {
            bot.sendMessage(adminID, "VIP STATUS berildi id: " + newVIPID)
            bot.sendMessage(newVIPID, "Tabriklaymiz sizga vip statusi berildi🥳")
            var ReferalID = user.toJSON().follow
            var Referal = await Users.findOne({
              where: {
                token: ReferalID
              }
            })
            var oldBalance = Referal.toJSON().balance
            var ReferalUser = await Users.update(
              { balance: oldBalance + 15000 },
              { where: { token: ReferalID } }
            )

            bot.sendMessage(newVIPID, await MainMsg(newVIPID))
          } else {
            bot.sendMessage(newVIPID, "Serverda xatolik yuzberdi tez orada sizga VIP STATUS beriladi")
          }
        }
      } catch (e) { 
        bot.sendMessage(adminID, "CHECK THE SERVER")
        console.log(e) 
      }
    }
  }
})