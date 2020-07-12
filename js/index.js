angular
  .module('tut', ['ngMaterial'])
  .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log,$http,$mdDialog) {
    $scope.genre = ["All","Action","Crime","Drama","Mystrey","Sci-Fi","Adventure"]
    $scope.tosend ={
      'genre':'All',
      'title':''
    }
    $scope.results = []
    $scope.genremode = false
    $scope.genreChanged = function(selection) {
      $scope.genremode = true
      $scope.results = []
      var retrievedData = JSON.parse(localStorage.getItem("Movies"));
      if (selection == 'All') {
        $scope.results = retrievedData
      }
      else {
        for (var i = 0; i < retrievedData.length; i++) {
          var filter = retrievedData[i].Genre.split(', ');
          console.log(filter,"llll");
          console.log(selection);
          var arraycontains = (filter.indexOf(selection) > -1);
          if (arraycontains==true) {
            $scope.results.push(retrievedData[i])
          }
        }
      }
    };

    $scope.searchmovie = function() {
      console.log("came");
      $scope.results = []
      isThere === false
      var retrievedData = JSON.parse(localStorage.getItem("Movies"));
      console.log(retrievedData,"retrievedData");
      if (retrievedData!=null) {
        for (var i = 0; i < retrievedData.length; i++) {
          var isThere = retrievedData[i].Title.toLowerCase().includes($scope.tosend.title.toLowerCase())
          console.log(isThere);
          console.log(retrievedData[i].Title.toLowerCase());
          console.log($scope.tosend.title.toLowerCase());
          if (isThere === true) {
            $scope.results.push(retrievedData[i])
            break;
          }
        }
      }
      if (isThere != true) {
        $http({
        method: 'GET',
        url: 'https://www.omdbapi.com/?t='+$scope.tosend.title+'&apikey='+'958f25f5'
        }).then(function successCallback(response) {
          if (response.data.Response != "False") {
            $scope.results.push(response.data)
            var localarray = []
            if (JSON.parse(localStorage.getItem("Movies"))!= null) {
              var newarray = JSON.parse(localStorage.getItem("Movies"))
              for (var i = 0; i < newarray.length; i++) {
                localarray.push(newarray[i])
                if ((localarray.indexOf($scope.results[0]) > -1) != true) {
                  localarray.push($scope.results[0])
                }
              }
            }
            else if(JSON.parse(localStorage.getItem("Movies"))== null){
              localarray.push($scope.results[0])
            }
            if (localarray.length>0) {
              console.log(localarray,"localarray");
              localStorage.setItem("Movies", JSON.stringify(localarray));
            }
            else if(localarray == null){
              console.log($scope.results[0],"$scope.results[0]");
              localStorage.setItem("Movies", JSON.stringify($scope.results[0]));
            }
          }
          else {
            $scope.results = []
          }
        },
      );
      }
     };
     $scope.showAdvanced = function(ev,passing,id) {
   $mdDialog.show({
     locals:{dataToPass: passing},
     controller: DialogController,
     templateUrl: 'dialogue.html',
     parent: angular.element(document.body),
     targetEvent: ev,
     clickOutsideToClose:true,
     fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
   })
   .then(function(answer) {
     $scope.status = 'You said the information was "' + answer + '".';
     $scope.results[id] = answer
     console.log(answer,"retrievedDataobj");
   }, function() {
     $scope.status = 'You cancelled the dialog.';
   });
 };
 function DialogController($scope, $mdDialog,dataToPass) {
   $scope.mdDialogData = dataToPass


    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.reset = function() {
      $scope.dialogdata = {
        'Poster':$scope.mdDialogData.Poster,
        'Year': $scope.mdDialogData.Year,
        'Genre': $scope.mdDialogData.Genre,
        'Director': $scope.mdDialogData.Director,
        'Actors': $scope.mdDialogData.Actors,
        'imdbRating':$scope.mdDialogData.imdbRating,
        'imdbID':$scope.mdDialogData.imdbID
      }
    };
    $scope.reset();
    $scope.save = function(id) {
      var retrievedDataobj = JSON.parse(localStorage.getItem("Movies"));
      for (var i = 0; i < retrievedDataobj.length; i++) {
        if (retrievedDataobj[i].imdbID == id) {
          retrievedDataobj[i].Year = $scope.dialogdata.Year
          retrievedDataobj[i].Genre = $scope.dialogdata.Genre
          retrievedDataobj[i].Director = $scope.dialogdata.Director
          retrievedDataobj[i].Actors = $scope.dialogdata.Actors
          localStorage.setItem("Movies", JSON.stringify(retrievedDataobj))
          var id = i
        }
      }
      $mdDialog.hide(retrievedDataobj[id]);


    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }


    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      };
    }
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
  })
