



// View

var marker, infowindow;
var locations = [
      
      {
      
      city: "Lake Mary, FL",
      latLng: 
                  {lat: 28.72589, lng: -81.3178}, 
      infoImage:"<img class='contentImage' src='images/roya.jpg'>"},
    

      {
     
      city: "Santiago, Chile", 
      latLng: 
                  {lat: -33.4489, lng: -70.6693}, 
      infoImage:"<img class='contentImage' src='images/chile.jpg'>", 
      flag: 'http://i.imgur.com/5PPszEx.png?1'},

      {
     
      city: "Medellin, Colombia",  
      latLng: 
                  {lat: 6.2442, lng: -75.5812}, 
      infoImage:"<img class='contentImage' src='images/colombia.jpg'>", 
      flag: 'http://i.imgur.com/v6tBbp6.gif?2'},
      
      {
        
      city: "Venice, Italy",  
      latLng: 
                  {lat: 45.4408, lng: 12.3155},
      infoImage:"<img class='contentImage' src='images/venice.jpg'>", 
      flag: 'http://i.imgur.com/VO4k3Ks.gif?1'},

      {
     
      city: "Dubai, UAE",   
      latLng: 
                  {lat: 25.2048, lng: 55.2708},
      infoImage:"<img class='contentImage' src='images/dubai.jpg'>", 
      flag: 'http://i.imgur.com/9P8aOMv.png?1'},

      {
     
      city: "Cancun, Mexico", 
      latLng: 
                  {lat: 21.1619, lng: -86.8515},
      infoImage:"<img class='contentImage' src='images/cancun.jpg'>", 
      flag: 'http://i.imgur.com/5ru5dDn.png?1'},

      {
      city: "Corfu, Greece", 
      latLng: 
                  {lat: 39.6243, lng: 19.9217},
      infoImage:"<img class='contentImage' src='images/greece.jpg'>", 
      flag: 'http://i.imgur.com/6Hri67g.png?1'}
    ];  








//Function to load map and start up app 

function initMap() {
  // constructor creates a new map 
  var mapProp =  {
          center: {lat: 28.52321, lng: -81.02323},
          zoom: 5
          
        };
  map = new google.maps.Map(document.getElementById('map'), mapProp);
  
  

  ko.applyBindings(new ViewModel());
};



// ViewModel
   


var ViewModel = function() {

  var self =  this;
  self.userInput = ko.observable('');
  self.bounds = new google.maps.LatLngBounds();
  self.allLocations = [];






  function Place(data) {
    this.city = data.city;
    this.latLng = data.latLng;
    this.flag = data.flag;
    this.infoImage = data.infoImage;
    
    

    
    // You will save a reference to the Places' map marker after you build the
    // marker:
    this.marker = null;


  }

 


// This pushes the locations to my list

  locations.forEach(function(place) {
    self.allLocations.push(new Place(place));

  });
  


  // Build Markers via the Maps API and place them on the map.
  self.allLocations.forEach(function(place) {

     
   var marker = {
      map: map,
      icon: place.flag,
      content: place.infoImage, 
      position: place.latLng,
      title: place.city,
      animation: google.maps.Animation.DROP
    };

  place.marker = new google.maps.Marker(marker);

   
    
    // create an onClick event to open an infowindow at each marker
          place.marker.addListener('click', function() {
          populateInfoWindow(place, infowindow);


        });

       


infowindow = new google.maps.InfoWindow();



// invoke toggleBounce to animate markers

place.marker.addListener('click', toggleBounce);

 



//  Create list function with click listener and bind to list items in index.html


self.locationList = function(place) {
  var marker = place.marker;
  var city = place.marker;
 
  google.maps.event.trigger(marker, 'click');
 
  
 
};



// Create array with most southern and northern markers as boundaries in order to fit all maps on screen

var LatLngList = new Array (new google.maps.LatLng (-33.4489, -70.6693), new google.maps.LatLng (45.4408,12.3155));

var bounds = new google.maps.LatLngBounds ();

for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {

  bounds.extend (LatLngList[i]);
}

//  Fit these bounds to the map
map.fitBounds (bounds);
 

 // Google docs referenced below toggle function
 function toggleBounce() {
      if (place.marker.getAnimation() !== null) {
        place.marker.setAnimation(null);
      } else {
        place.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){
          place.marker.setAnimation(null);
        }, 2000);
      }
    }

 
});

 var populateInfoWindow = function(place, infowindow) {

 
  var marker = place.marker;
  var city = place.city;


   //  Wiki AJAX request

  var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city  + 
  '&format=json';
  $.ajax({
    url: wikiUrl,
    dataType: "jsonp",
    success:  function(response) {
        var articleList = response[1];
          for (var i = 0; i < articleList.length; i++) {
            articleStr = articleList[i];
            var url = "https://en.wikipedia.org/wiki/" + articleStr;

            if(infowindow.marker != marker) {
              infowindow.marker = marker;
             var contentString = '<div>' + '<h4>' + marker.title + '</h4>' + marker.content + '</div>' + '<a href=" ' + url +'">' + articleStr + '</a>';
             var wikiAtrib = '<div>' + '<p>' + "Information about " + city + " is provided by Wikipedia" + '</p>' +'</div>';
             infowindow.setContent(contentString + wikiAtrib);
             infowindow.open(map, marker);
      // clear marker property if infowindow is closed
      infowindow.addListener('closeclick', function() {
      
      });

    }
    }    

          

       
  } 
 });


  




};






  
  
  // This array will contain only the markers that should
  // be visible based on user input. 
  self.visiblePlaces = ko.observableArray();
  



  
  // All places should be visible at first. We only want to remove them if the
  // user enters some input which would filter some of them out.
  self.allLocations.forEach(function(place) {
    self.visiblePlaces.push(place);
  });
  
  

  
  
  
  
  self.filterMarkers = function() {

    
    var searchInput = self.userInput().toLowerCase();
    
    self.visiblePlaces.removeAll();
    
    // This looks at the name of each places and then determines if the user
    // input can be found within the place name.
    self.allLocations.forEach(function(place) {
      place.marker.setVisible(false);
      
      if (place.city.toLowerCase().indexOf(searchInput) !== -1) {
        self.visiblePlaces.push(place);


      }

          });
    
    
    self.visiblePlaces().forEach(function(place) {
      place.marker.setVisible(true);

      

    });




  }






  
};





// fix this for error handling later


// function googleError() {
//     if (typeof $ === "object") {
//         $("#map").html("Fail to load Google maps");
//     } else {
//         document.getElementById("map").innerHTML = '<h2>Fail to load Google maps...</h2>';
//     };


