# uSpeak v3
Esta es la tercera versión de la aplicación construida utilizando [Brunch](http://brunch.io/).

Los lenguajes utilizados son [CoffeeScript](http://coffeescript.org/),
[Stylus](http://learnboost.github.com/stylus/) y
[Handlebars](http://handlebarsjs.com/).

## Para empezar

Clona el repositiorio y ejecuta `npm install` para instalar las dependencias.
Para correr el servidor de prueba ejecuta `npm start`.

## Sincronizar con el servidor

Para publicar todos los cambios en el servidor de uSpeak hay que instalar [Fabric](http://fabfile.org/) y entonces ejecutar `fab sync`.

## Resumen

    config.coffee
    README.md
    /app/
      /assets/
        index.html
        images/
      /lib/
      models/
      styles/
      views/
      application.coffee
    /test/
      functional/
      unit/
    /vendor/
      scripts/
        common/
          jquery-1.7.2.js
          jquery.keyframe.js
          jquery.transit.js
          cryptojs.js
          handlebars-helpers.js
          console-helper.js
          modernizr.js
          soundmanager2.js
          underscore-1.3.3.js
        spine/
          spine.js
          lib/ajax.js
          lib/local.js
          lib/manager.js
          lib/route.js
          lib/tmpl.js
      styles/
        normalize.css
        helpers.css

* `config.coffee` contiene la configuración de la app. 
* `app/assets` contiene las imágenes / ficheros estáticos. Los contenidos se copiarán en `build/` sin cambios ni optimizaciones.
Los otros subdirectorios de `app/` podrían contener archivos que serán compilados. Los lenguajes que se compilan a Javascript (coffeescript, roy etc.), o los archivos js **se incluirán automáticamente en el módulo** y pueden ser cargados vía  `require('module/location')`.
* `app/models` contiene los modelos de la aplicación (utilizando `Resources`, inspirado en AngularJS Resources).
* `app/controllers` contiene los controladores de la aplicación.
* `app/views` contiene las vistas, que serán renderizadas con `Handlebars`.
* `test/` contiene los tests unitarios.
* `vendor/` contiene todo los códigos de terceros. Este código se cargará aparte de los módulos.

Todo esto se guardará en `public/` (por defecto) cuando se ejecute `brunch build` o `brunch watch`.

## Otros
Frameworks utilizados:

* jQuery 1.7.2
* Spine 1.0.6
* Underscore 1.3.3
* HTML5Boilerplate 3.0.3
* FontAwesome 1.0
* Fabric

El uso de esta aplicación está restringido a la empresa `uSpeak` y sus trabajadores.
