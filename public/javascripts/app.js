angular.module('polling',[])
.controller('PollControl',[
  '$scope','$http',
  function($scope, $http){
    $scope.ballot =[];
    $scope.submittedBallot = [];

    /* Create the candidate
       --This is called by the addCandidate
       --Adds to DB using  post AND adds to $scope.ballot[]
       --Because the angular.copy() in getAll is a deep copy, it keeps all info
       --Ballot.data is the array within the other wrapper information
    */
    $scope.create = function(candidate) {
       return $http.post('/candidates', candidate).then(function(data){
         $scope.ballot.data.push(data.data);
	 //console.log($scope.ballot);
       });
    };

    /* Add candidate
       --This pulls the data from the form
       --Calls the create function to add to database and $scope.ballot
    */
    $scope.addCandidate = function(){
      if($scope.firstName === '' && $scope.lastName === '') { return; }
      $scope.create({
         firstName: $scope.firstName,
         lastName: $scope.lastName,
         votes: 0,
      });
      $scope.firstName = '';
      $scope.lastName = '';   
    };
    
    /*Vote
      --Increases the votes in the database (PUT)
      --Increments the votes in the $scope.ballot
    */
    $scope.vote = function(candidate){
	//console.log(candidate);     
	//console.log(candidate._id);
        return $http.put('/candidates/' + candidate._id + '/vote')
        .then(function(){
          //console.log("vote worked");
          candidate.votes += 1;
        });
    };

    /*DoVote
      --This is to go through the list of selected candidates and increment all their votes
    */
     $scope.dovote = function() {
	//console.log("In DoVote");
        angular.forEach($scope.ballot.data, function(value,key){
          if(value.selected){
            $scope.vote(value);
            $scope.submittedBallot.push(value);
          };
        });
     };  


    /*Delete
      --Deletes a candidate from the database
      --Reloads the database list into the $scope.ballot
    */
    $scope.delete = function(candidate) {
	$http.delete('/candidates/' + candidate._id)
             .then(function(){
		//console.log("delete worked");
          $scope.getAll(); //This needs to go inside, otherwise it will work asyncly
	});
      };        

    //Fill the $scope.ballot with the candidates from the database
    $scope.getAll = function(){
      return $http.get('/candidates').then(function(ballot){
        //console.log(ballot);
        angular.copy(ballot, $scope.ballot);    
      });
    };
    $scope.getAll(); //Call the function



  }//End $scope function
]);//End controller
