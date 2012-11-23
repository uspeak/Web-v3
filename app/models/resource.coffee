Ajax = Spine.Ajax
$      = Spine.$
Events = Spine.Events
Log = Spine.Log
Module = Spine.Module
Model = Spine.Model

#Taked from https://github.com/angular/angular.js/blob/master/src/ngResource/resource.js
class Route
  constructor: (@template, @defaults) ->
    @template += "#"
    @defaults or= {}
    @urlParams = {}
    for param in @template.split(/\W/)
      @urlParams[param] = true if param and @template.match(new RegExp("[^\\\\]:#{param}\\W"))
    @template = @template.replace(/\\:/g, ":")

  encodeUriSegment: (val) ->
    @encodeUriQuery(val, true)
      .replace(/%26/g, "&")
      .replace(/%3D/g, "=")
      .replace(/%2B/g, "+")

  encodeUriQuery: (val, pctEncodeSpaces) ->
    encodeURIComponent(val)
      .replace(/%40/g, "@")
      .replace(/%3A/g, ":")
      .replace(/%24/g, "$")
      .replace(/%2C/g, ",")
      .replace(((if pctEncodeSpaces then null else /%20/g)), "+")

  url: (params) ->
    url = @template
    params = params or {}
    for urlParam, _ of @urlParams
      val = (if params.hasOwnProperty(urlParam) then params[urlParam] else @defaults[urlParam])
      if val isnt null
        url = url.replace new RegExp(":#{ urlParam }(\\W)", "g"), "#{ @encodeUriSegment(val) }$1"
      else
        url = url.replace new RegExp("/?:#{ urlParam }(\\W)", "g"), "$1"
    
    url = url.replace(/\/?#$/, "")
    query = []
    for key,value of params
      query.push "#{ @encodeUriQuery(key) }=#{ @encodeUriQuery(value) }" unless @urlParams[key]

    query.sort()
    url = url.replace(/\/*$/, "")
    if query.length
      url += "?" + query.join("&")
    url

class Resource extends Model
  @include Events
  # @extend Spine.Model.Ajax
  @include Log
  defaults: Ajax.defaults

  constructor: ->
    super
    @route = new Route(@url)
    for name, action of @actions
      # @log name, action
      @[name] = (data, params) =>
        hasBody = action.method in ['POST', 'PUT', 'PATCH']
        if not hasBody
          params = data
          data = null
        trigger = action.trigger != false
        # @log action.params, @route.url(action.params)
        after =  => 
          Spine.trigger('ajax:after') if trigger
        @ajaxQueue(
          params,
          type: action.method or 'GET',
          data: if data then JSON.stringify(data) else null,
          url: @route.url( _.extend({}, action.params, params) )
          trigger: trigger
        ).done((data, status, xhr) =>
          # @log '********LOADED', data, status, xhr, action.done
          # after()
          @trigger(action.done, data, status, xhr) if action.done  
        )
        .fail((xhr, statusText, error) =>
          @trigger(action.fail, xhr, statusText, error) if action.fail
        )
        .then(after,after)


  ajaxSettings: (params, defaults) ->
    $.extend({}, @defaults, defaults, params)

  ajaxQueue: (params, defaults) ->
    jqXHR    = null
    deferred = $.Deferred()
    promise  = deferred.promise()
    return promise unless Ajax.enabled

    settings = @ajaxSettings(params, defaults)
    Spine.trigger('ajax:before') if defaults.trigger
    request = (next) ->
      jqXHR = $.ajax(settings)
                .done(deferred.resolve)
                .fail(deferred.reject)
                .then(next, next)
    promise.abort = (statusText) ->
      return jqXHR.abort(statusText) if jqXHR
      index = $.inArray(request, Ajax.queue())
      Ajax.queue().splice(index, 1) if index > -1

      deferred.rejectWith(
        settings.context or settings,
        [promise, statusText, '']
      )
      promise

    Ajax.queue request
    promise


# [error, success, params, data] = (->
#   params = {}
#   success = ->
#   data = {}
#   error = null
#   br = false
#   if arguments.length == 4
#     error = a4
#     success = a3
#   if arguments.length in [2,3,4]
#     if typeof a2 is 'function'
#       if typeof a1 is 'function'
#         error = a1
#         success = a1
#         br = true
#       success = a2
#       error = a3
#     else
#       params = a1
#       data = a2
#       success = a3
#       br = true
#   if not br and arguments.length
#     if typeof a1 is 'function'
#       success = a1
#     else if hasBody
#       data = a1
#     else
#       params = a1
#   return [error, success, params, data]
# )()

module.exports = Resource