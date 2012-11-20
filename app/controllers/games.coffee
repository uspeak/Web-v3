class Games extends Spine.Stack
  className: 'games'
  controllers:
    whichone: require('controllers/games/whichone')
    flipcards: require('controllers/games/flipcards')
    fatfingers: require('controllers/games/fatfingers')
    association: require('controllers/games/association')
    yayornay: require('controllers/games/yayornay')
  routes:
    '/play/whichone': 'whichone'
    '/play/flipcards': 'flipcards'
    '/play/fatfingers': 'fatfingers'
    '/play/association': 'association'
    '/play/yayornay': 'yayornay'
  
  deactivate: ->
    super
    @manager.deactivate()

module.exports = Games
