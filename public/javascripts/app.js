angular.module('shopping',[])
.controller('ShopControl',[
  '$scope','$http',
  function($scope, $http){
    $scope.cart =[];
    $scope.submittedCart = [];

    /* Create the product
       --This is called by the addproduct
       --Adds to DB using  post AND adds to $scope.cart[]
       --Because the angular.copy() in getAll is a deep copy, it keeps all info
       --cart.data is the array within the other wrapper information
    */
    $scope.create = function(product) {
       return $http.post('/products', product).then(function(data){
         $scope.cart.data.push(data.data);
	 //console.log($scope.cart);
       });
    };

    /* Add product
       --This pulls the data from the form
       --Calls the create function to add to database and $scope.cart
    */
    $scope.addProduct = function(){
      if($scope.name === '' && $scope.price === '') { return; }
      $scope.create({
         name: $scope.name,
         price: $scope.price,
         purchases: 0,
         imgURL: $scope.imgURL,
      });
      $scope.name = '';
      $scope.price = '';
      $scope.imgURL = '';
    };

    /*purchase
      --Increases the purchases in the database (PUT)
      --Increments the purchases in the $scope.cart
    */
    $scope.purchase = function(product){
	//console.log(product);
	//console.log(product._id);
        return $http.put('/products/' + product._id + '/purchase')
        .then(function(){
          //console.log("purchase worked");
          product.purchases += 1;
        });
    };

    /*addToCart
      --This is to go through the list of selected products and increment all their purchases
    */
     $scope.addToCart = function() {
	//console.log("In addToCart");
        angular.forEach($scope.cart.data, function(value,key){
          if(value.selected){
            $scope.purchase(value);
            if (!$scope.submittedCart.includes(value)){
              //console.log("Not in already in cart");
              $scope.submittedCart.push(value);
            }
          };
        });
     };


    /*Delete
      --Deletes a product from the database
      --Reloads the database list into the $scope.cart
    */
    $scope.delete = function(product) {
	$http.delete('/products/' + product._id)
             .then(function(){
		//console.log("delete worked");
          $scope.getAll(); //This needs to go inside, otherwise it will work asyncly
	});
      };

    //Fill the $scope.cart with the products from the database
    $scope.getAll = function(){
      return $http.get('/products').then(function(cart){
        console.log(cart);
        angular.copy(cart, $scope.cart);
      });
    };
    $scope.getAll(); //Call the function



  }//End $scope function
]);//End controller
