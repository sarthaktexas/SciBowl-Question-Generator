function SciQuestions($scope) {
  var socket = io.connect();

  $scope.options = {
    categories: {
      math: true,
      biology: true,
      chemistry: true,
      earthspace: true,
      //compsci: true,
      general: true,
      physics: true,
      energy: true
    },
    difficulties: {
      HS: true,
      MS: true
    },
    types: {
      multiple_choice: true,
      short_answer: true
    },
    bonus: true,
    last_category: null,
    last_difficulty: null
  };

  $scope.showAnswer = true;

  $scope.difficulty = "";
  $scope.category = "";
  $scope.bonus = false;
  $scope.question = "Press the Get Question button to display a random question!";
  $scope.answer = "";
  $scope.numQuestions = 0;
  $scope.choices = [];

  socket.emit('getNumQuestions');

  socket.on('error', function(msg) {
    $('#alert_placeholder').html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + msg + '</div>');
  });

  socket.on('numQuestions', function(data) {
    console.log("There are " + data + " questions in the database!");
    $scope.numQuestions = data;
    $scope.$apply();
  });

  socket.on('sendQuestion', function(data) {
    console.log("Recieved question");
    console.log(data);
    $('#alert_placeholder').alert('close');
    var q = data.question;
    var category = data.category;
    $scope.difficulty = q.difficulty;
    $scope.category = category;
    $scope.question = q.question;
    $scope.answer = q.answer;
    $scope.bonus = q.bonus;

    if (q.hasOwnProperty('multiple_choice')) {
      $scope.choices = q.multiple_choice;
    }
    else {
      $scope.choices = [];
    }
    $scope.$apply()
  });

  $scope.getQuestion = function getQuestion() {
    if ($scope.showAnswer) {
      console.log("Requesting a question...");
      if (!$scope.bonus) {
        $scope.options.last_category = $scope.category;
        $scope.options.last_difficulty = $scope.difficulty;
      }
      else {
        $scope.options.last_category = null;
        $scope.options.last_difficulty = null;
      }

      socket.emit('getQuestion', $scope.options);
    }
    $scope.showAnswer = !$scope.showAnswer;
  }

  $scope.getButtonText = function getButtonText() {
    return $scope.showAnswer ? "Get Question" : "Get Answer";
  }
}