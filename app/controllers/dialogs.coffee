class Dialog extends Spine.Controller

  styles:
    out: scale: 1.5, opacity:0
    in: scale: .5, opacity:0
    normal: scale: 1, opacity:1

  transitionTime: 400

  constructor: ->
    @className = (@className? or '')+' dialog'
    super
    @activated = false
    @el.hide()
    @render()

  render: ->
    @html require(@template)()

  activate: ->
    @stack.showDialog @

  deactivate: ->

  show: ->
    return if @activated

    @trigger 'activate'
    @activated = true

    prev = @stack.current?.stackIndex() or -1
    next = @stackIndex()

    from = if prev<next then @styles.in else @styles.out
    @el.show()
    @el.css from
    @el.css('margin-top',- @el.outerHeight(false)/2)

    @el.transition @styles.normal, @transitionTime, =>
      @trigger 'activated'
      @activate()

    @stack.current = @
    @stack.next = null

  hide: ->
    return if not @activated
    @trigger 'deactivate'
    @activated = false

    prev = @stackIndex()
    next = @stack.next?.stackIndex() #For going Bigger if not next
    if not @stack.next
      next = 10000

    to = if prev<next then @styles.out else @styles.in
    @el.transition to, @transitionTime, =>
      @el.hide()
      @trigger 'deactivated'


  stackIndex: ->
    @stack.line.indexOf @constructor

class DialogMain extends Dialog
  template: 'views/dialog.main'

class DialogDiagnostic extends Dialog
  template: 'views/dialog.diagnostic'

User = require 'models/user'

class DialogLogin extends Dialog

  template: 'views/dialog.login'
  events:
    "submit form": 'login'

  constructor: ->
    super
    User.bind 'login:failed', @loginFailed
    User.bind 'login:success', @loginSuccess

  login: (e) ->
    e.preventDefault()
    app.user.login 'test','test'

  loginFailed: =>
    @el.keyframe 'shake', 800, 'linear'

  loginSuccess: =>
    @hide()


class DialogRecover extends Dialog
  template: 'views/dialog.recover'

class Dialogs extends Spine.Stack

  className: 'dialog-stack'
  controllers:
    main: DialogMain
    diagnostic: DialogDiagnostic
    login: DialogLogin
    recover: DialogRecover

  line: [DialogMain, DialogDiagnostic, DialogLogin, DialogRecover]
  routes:
    '/':      'main'
    '/diagnostic': 'diagnostic'
    '/login': 'login'
    '/recover': 'recover'

  # default: 'show'

  constructor: ->
    @next = null
    @current = null
    super

  showDialog: (dialog) ->
    return if dialog is @current
    # @log 'SHOWING', dialog
    @next = dialog
    if @current
      # @log 'CURRENT IS ',@current
      last = @current
      last.one 'deactivated', =>
        dialog.show()
      last.hide()
    else
      dialog.show()

module.exports = Dialogs
