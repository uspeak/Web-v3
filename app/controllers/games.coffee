class Games extends Spine.Stack
  className: 'games'
  controllers:
    whichone: require('controllers/games/whichone')
    flipcards: require('controllers/games/flipcards')
    fatfingers: require('controllers/games/fatfingers')
  routes:
    '/play/whichone': 'whichone'
    '/play/flipcards': 'flipcards'
    '/play/fatfingers': 'fatfingers'

module.exports = Games
