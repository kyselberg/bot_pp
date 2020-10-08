const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs')
const TOKEN = '1264091627:AAF7yYUmtrCP6-RxtnUdSpOTUYmzq1dWJKw'
const bot = new TelegramBot(TOKEN, {polling: true})

const date = []
const emoji = [
  '😀', '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '☺', '😊', '😇', '🙂',
  '🙃', '😉', '😌', '😍', '🥰', '😘', '😻', '🥳', '🌞','🌝','🌕','🌖','🌗','🌘'
]
const meetList = [[{text: '02.02', callback_data: '02.02'}]]
const foodList = []
const songList = []
const mainList = [
  [
    {
      text: 'Регистрация',
      callback_data: 'registration'
    },
    {
      text: 'Еда',
      callback_data: 'food'
    }
  ],
  [
    {
      text: 'Песни',
      callback_data: 'songs'
    },
    {
      text: 'Встречи',
      callback_data: 'meetings'
    }
  ],
  [
    {
      text: 'Фото с последней встречи',
      // url: 'https://google.com',
      callback_data: 'notPhoto'
    }
  ]
]
const backButton = [{text: '<< Назад', callback_data: 'home'}]

// admin -----v
// log days of month 1 - 31
const logDateDay = () => {
  const dayArr = []
  for (let i = 1; i <= 31; i++) {
    const number = i < 10 ? '0' + i : i
    const day = [
      {text: `${ number }`, callback_data: `d:${ number }`}
    ]
    dayArr.push(day)
  }
  return dayArr
}
// log months 1 - 12
const logDateMonth = () => {
  const monthArr = []
  for (let i = 1; i <= 12; i++) {
    const number = i < 10 ? '0' + i : i
    const month = [
      {text: `${ number }`, callback_data: `m:${ number }`}
    ]
    monthArr.push(month)
  }
  return monthArr
}
const getRandomNumber = maxPoint => Math.floor(Math.random() * maxPoint)
const getEmoji = arr => {
  const index = getRandomNumber(arr.length)
  return arr[index]
}
// admin -----^



// client
// start of bot

bot.onText(/\/start/, msg => {
  const chatID = msg.chat.id
  bot.sendPhoto(chatID, fs.readFileSync(__dirname + '/gif/catty.png'), {
    reply_markup: {
          inline_keyboard: mainList
        }
  })
})

bot.on('callback_query', query => {
  const chatID = query.message.chat.id
  const messageID = query.message.message_id
  const queryID = query.id
  const queryData = query.data

  // admin -----v
  if ( /^d:(0[1-9]$|[12][0-9]$|3[01]$)/.test(queryData) ) {
    const index = query.data.indexOf(':')
    const day = query.data.slice(index+1)
    date.push(day)
    bot.sendMessage(chatID, 'А теперь выберите месяц встречи: ', {
      reply_markup: {
        inline_keyboard: logDateMonth()
      }
    })
  } else if ( /^m:(0[1-9]$|1[0-2]$)/.test(queryData) ) {
    const index = query.data.indexOf(':')
    const month = query.data.slice(index+1)
    date.push(month)
    const meeting = date.join('.')
    meetList.push([{text: meeting, callback_data: meeting}])
    bot.sendMessage(chatID, 'Список ваших встреч выглядит сейчас так: ', {
      reply_markup: {
        inline_keyboard: [
          ...meetList,
          backButton
        ]
      }
    })
    date.splice(0)
  } else if (/^(0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[0-2])$/.test(queryData)) {
    bot.sendMessage(chatID, 'Сошлось')
  }

  // admin-----^

    switch (queryData) {
      case 'registration': {
        if (meetList.length === 0) {
          bot.answerCallbackQuery(
            queryID,
            'Регистрация пока закрыта, следите за обновлениями 🌼', {
              show_alert: true,
            })
          // bot.sendMessage(chatID, 'Зарегестрироваться вы сможете чуть позже...\nСледите за обновлениями😌', {
          //   reply_markup: {
          //     inline_keyboard: [backButton]
          //   }
          // })
        } else {
          bot.sendMessage(chatID, 'Чтобы зарегистрироваться на встречу, тебе необходимо выбрать дату, и всё!\nТак просто!😻', {
            reply_markup: {
              inline_keyboard: [
                ...meetList,
                backButton
              ]
            }
          })
          bot.deleteMessage(chatID, messageID)
        }
        break
      }
      case 'food': {
        if (foodList.length === 0) {
          bot.answerCallbackQuery(
            queryID,
            'Еды пока нет, но скоро она будет готова 🍕', {
              show_alert: true,
            })
        } else {
          bot.sendMessage(chatID, 'Ты можешь сразу оплатить меню, или сначала посмотреть на него ⤵️', {
            reply_markup: {
              inline_keyboard: foodList
            }
          })
        bot.deleteMessage(chatID, messageID)
        }
        break
      }
      case 'songs': {
        if (songList.length === 0) {
          bot.answerCallbackQuery(
            queryID,
            'Песен пока нет, но мы ищем самые лучшие для тебя 🎷', {
              show_alert: true,
            })
        } else {
          bot.sendMessage(chatID, 'Выбери песню, слова которой ты хочешь увидеть ⤵️', {
            reply_markup: {
              inline_keyboard: meetList
            }
          })
        bot.deleteMessage(chatID, messageID)
        }
        break
      }
      case 'meetings': {
        if ( meetList.length === 0 ){
          bot.answerCallbackQuery(
            queryID,
            'Встречи пока в тайне, но скоро ты будешь посвещен 💎', {
              show_alert: true,
            })
        } else {
          bot.sendMessage(chatID, 'Если ты хочешь попасть на нашу встречу нажми на дату для регистрации👇', {
            reply_markup: {
              inline_keyboard: [
                ...meetList,
                backButton
              ]
            }
          })
        bot.deleteMessage(chatID, messageID)
        }
        break
      }
      case 'home': {
        const number = getRandomNumber(5)
        bot.deleteMessage(chatID, messageID)
          .then(() => bot.sendMessage(chatID, getEmoji(emoji)))
          .then(() => bot.sendAnimation(chatID, fs.readFileSync(__dirname + `/gif/gif-${ number }.gif`), {
            reply_markup: {
              inline_keyboard: mainList
            }
          }))
          .catch(e => console.log(e))
        break
      }
      case 'notPhoto' : {
        bot.answerCallbackQuery(
          queryID,
          'Фото пока нет, но будь готов, что увидишь себя', {
            show_alert: true,
          })
      }
    }
})





// admin commands


bot.onText(/\/addMeet/, msg => {
  bot.sendMessage(msg.chat.id, 'Выберите день встречи: ', {
    reply_markup: {
      inline_keyboard: logDateDay()
    }
  })
})

bot.onText(/\/home/, msg => {
  bot.sendAnimation(msg.chat.id, './imgs/home.gif', {
    reply_markup: {
      inline_keyboard: mainList
    }
  })
})
