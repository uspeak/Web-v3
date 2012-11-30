exports.config =
  # See docs at http://brunch.readthedocs.org/en/latest/config.html.
  paths:
    public: 'build/uspeak-web/'
    test: 'spec'
    
  files:
    javascripts:
      defaultExtension: 'coffee'
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor/
      order:
        before: [
          'vendor/scripts/common/cryptojs.js',
          'vendor/scripts/common/jquery-1.7.2.js',
          'vendor/scripts/common/jquery.transit.js',
          'vendor/scripts/common/jquery.keyframe.js',
          'vendor/scripts/common/modernizr.js',
          'vendor/scripts/common/soundmanager2.js',
          'vendor/scripts/spine/spine.js',
          'vendor/scripts/spine/lib/ajax.js',
          'vendor/scripts/spine/lib/local.js',
          'vendor/scripts/spine/lib/manager.js',
          'vendor/scripts/spine/lib/route.js',
          'vendor/scripts/spine/lib/tmpl.js'
          'vendor/scripts/spine/touch.js',
        ],
        after: [
          'vendor/scripts/common/handlebars-helpers.js'
        ]

    stylesheets:
      defaultExtension: 'styl'
      joinTo: 'stylesheets/app.css'
      order:
        before: [
          'vendor/styles/animate.css',
          'vendor/styles/normalize.css',
          'vendor/styles/font-awesome.css'
        ]
        after: [
          'vendor/styles/helpers.css'
        ]

    templates:
      joinTo: 'javascripts/app.js'

  imageoptimizer:
    smushit: false
    path: 'images'

      # order:
      #   before: ['node_modules/jade/jade.js']
