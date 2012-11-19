Resource = require 'models/resource'

class Games extends Resource
  url: 'http://v4.uspeakapp.com/userGames/getGameWords/:lang_dir/:game.json'
  actions:
    get:
      params:
        lang_dir: "2"
      done: 'game:loaded'

module.exports = Games