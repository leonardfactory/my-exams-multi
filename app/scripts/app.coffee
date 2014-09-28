app = angular.module 'app', ['ionic', 'ngStorage']

app.run ($ionicPlatform) ->
  $ionicPlatform.ready ->
    if window.cordova and window.cordova.plugins.Keyboard
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar true
      
    if window.StatusBar
      StatusBar.styleDefault()