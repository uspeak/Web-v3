Resource = require 'models/resource'

class Games extends Resource
  url: 'http://v5.uspeakapp.com/userGames/getGameWords/:lang_dir/:game.json'
  actions:
    get:
      params:
        lang_dir: "2"
      done: 'game:loaded'

class Played extends Resource
  url: 'http://v5.uspeakapp.com/userGames/played.json'
  actions:
    send:
      done: 'game:played'
      method: 'POST'


Games.Played = Played

module.exports = Games