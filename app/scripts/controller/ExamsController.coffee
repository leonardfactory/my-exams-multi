app.controller 'ExamsController',
  class ExamsController
    constructor: (@$scope, $ionicModal, $localStorage) ->
      @$scope.$storage = $localStorage
      
      # Precarico la modal per mostrare 'Aggiungi Esame'
      @$scope.exam = {}
      
      $ionicModal.fromTemplateUrl 'templates/add-exam.html',
        scope: @$scope
        animation: 'slide-in-up'
      .then (modal) =>
        @$scope.modal = modal
      
      @$scope.addExam = =>
        @$scope.modal.show()
        
      @$scope.saveExam = =>
        @$scope.$storage.exams = [] if not @$scope.$storage.exams?
        
        # Controllo se ci sono altri esami con lo stesso nome
        
        @$scope.$storage.exams.push @$scope.exam
        @$scope.modal.hide()
        
      # Resetto lo scope (exam) quando è stato inserito
      @$scope.$on 'modal.hidden', =>
        @$scope.exam = {}
          
        
        
      
      