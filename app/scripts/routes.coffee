app.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider.state("tab",
    url: "/tab"
    abstract: true
    templateUrl: "templates/tabs.html"
  )
  .state('tab.exams',
    url: '/exams'   # Qui utilizziamo solo /exams perché il prefisso `/tab` è calcolato automaticamente dallo stato `tab.exams` (`tab` redirige all'url `/tab`)
    views: 
      'tab-exams':
        templateUrl: 'templates/tab-exams.html'
        controller: 'ExamsController'
  )
  .state('tab.stats',
    url: '/stats'
    views:
      'tab-stats':
        templateUrl: 'templates/tab-stats.html'
        controller: 'StatsController'
  )
  .state('tab.settings',
    url: '/settings'
    views:
      'tab-settings':
        templateUrl: 'templates/tab-settings.html'
        controller: 'SettingsController'
  )
  
  $urlRouterProvider.otherwise '/tab/exams'