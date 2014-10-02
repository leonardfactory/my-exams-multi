app.controller 'ExamsController',
  class ExamsController
    constructor: (@$scope, $ionicModal, $localStorage) ->
      @$scope.$storage = $localStorage
      
      # Eliminazione, reordering ecc.
      @$scope.status =
        canSwipe: true
      
      # Precarico la modal per mostrare 'Aggiungi Esame'
      @$scope.exam = {}
      @$scope.shownExamInfo =
        isEditing: false
        examIndex: -1
      
      $ionicModal.fromTemplateUrl 'templates/add-exam.html',
        scope: @$scope
        animation: 'slide-in-up'
      .then (modal) =>
        @$scope.modal = modal
      
      @$scope.addExam = =>
        @$scope.exam = {}
        @$scope.shownExamInfo.isEditing = false
        @$scope.modal.show()
        
      @$scope.saveExam = =>
        @$scope.$storage.exams = [] if not @$scope.$storage.exams?
        
        # Controllo se ci sono altri esami con lo stesso nome
        
        if @$scope.shownExamInfo.isEditing
          @$scope.$storage.exams[@$scope.shownExamInfo.examIndex] = @$scope.exam
        else
          @$scope.$storage.exams.push @$scope.exam
          
        @$scope.modal.hide()
      
      # Eliminazione
      @$scope.delete = ($index) =>
        @$scope.$storage.exams.splice $index, 1
        
      # Modifica
      @$scope.edit = ($index) =>
        @$scope.exam = @$scope.$storage.exams[$index]
        @$scope.shownExamInfo.isEditing = true
        @$scope.shownExamInfo.examIndex = $index
        @$scope.modal.show()
        
      # Resetto lo scope (exam) quando è stato inserito
      @$scope.$on 'modal.hidden', =>
        @$scope.exam = {}
          
        
        
      
      