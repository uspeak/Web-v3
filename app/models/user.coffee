Resource = require 'models/resource'

class User extends Resource
  url: 'http://v4.uspeakapp.com/users/:controller.json'
  actions:
    register:
      method: "POST"
      params:
        controller: "add"
    token:
      method: "POST"
      params:
        controller: "token"
      done: 'login:success'
      fail: 'login:failed'

  constructor: ->
    super
    @bind 'login:failed', @loginFailed
    @bind 'login:success', @loginSuccess

  loginFailed: ->
    delete Spine.Ajax.defaults.headers['Authorization']

  getHeader: (username, password) ->
    password or= ""
    auth = Base64.encode64("#{username}:#{password}")
    "Basic #{auth}"

  login: (username, password) ->
    @token null,
      beforeSend: (xhr)=>
        xhr.setRequestHeader "Authorization", @getHeader username,password

  setToken: (token) ->
    Spine.Ajax.defaults.headers['Authorization'] = @getHeader token
  
  loginSuccess: (user, data) ->
    # console.log arguments
    @setToken data.res
    @username = data.username
    @trigger 'login'

module.exports = User