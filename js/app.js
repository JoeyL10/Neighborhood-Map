



// View

var marker, infowindow;
var locations = [
      
      {
      
      continent:  "North America",
      city: "Lake Mary, FL",
      cityTitle: "<h4>Lake Mary, Florida</h4>",  
      latLng: 
                  {lat: 28.72589, lng: -81.3178}, 
      infoImage:"<img class='contentImage' src='images/roya.jpg'>"},
    

      {
      continent: "South America",
      city: "Santiago, Chile", 
      cityTitle: "<h4>Santiago, Chile</h4>",  
      latLng: 
                  {lat: -33.4489, lng: -70.6693}, 
      infoImage:"<img class='contentImage' src='images/chile.jpg'>", 
      flag: 'http://i.imgur.com/5PPszEx.png?1'},

      {
      continent: "South America",
      city: "Medellin, Colombia",
      cityTitle: "<h4>Medellin, Colombia</h4>",   
      latLng: 
                  {lat: 6.2442, lng: -75.5812}, 
      infoImage:"<img class='contentImage' src='images/colombia.jpg'>", 
      flag: 'http://i.imgur.com/v6tBbp6.gif?2'},
      
      {
      continent: "Europe",    
      city: "Venice, Italy",
      cityTitle: "<h4>Venice, Italy</h4>",     
      latLng: 
                  {lat: 45.4408, lng: 12.3155},
      infoImage:"<img class='contentImage' src='images/venice.jpg'>", 
      flag: 'http://i.imgur.com/VO4k3Ks.gif?1'},

      {
      continent: "Asia",
      city: "Dubai, UAE",
      cityTitle: "<h4>Dubai, UAE</h4>",     
      latLng: 
                  {lat: 25.2048, lng: 55.2708},
      infoImage:"<img class='contentImage' src='images/dubai.jpg'>", 
      flag: 'http://i.imgur.com/9P8aOMv.png?1'},

      {
      continent: "North America",
      city: "Cancun, Mexico", 
      cityTitle: "<h4>Cancun, Mexico</h4>",    
      latLng: 
                  {lat: 21.1619, lng: -86.8515},
      infoImage:"<img class='contentImage' src='images/cancun.jpg'>", 
      flag: 'http://i.imgur.com/5ru5dDn.png?1'}
    ];  








//Function to load map and start up app 

function initMap() {
  // constructor creates a new map 
  var mapProp =  {
          center: {lat: 28.52321, lng: -81.02323},
          zoom: 6
          
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
    this.cityTitle = data.cityTitle;
    

    
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
      title: place.cityTitle,
      animation: google.maps.Animation.DROP
    };

  place.marker = new google.maps.Marker(marker);

   
    
    // create an onClick event to open an infowindow at each marker
          place.marker.addListener('click', function() {
          populateInfoWindow(place, infowindow);


        });

       


infowindow = new google.maps.InfoWindow();

place.marker.addListener('click', toggleBounce);

 // API calls

 //  Wiki AJAX request
 

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

  var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city  + 
  '&format=json';
  $.ajax({
    url: wikiUrl,
    dataType: "jsonp",
    success:  function(response) {
        var articleList = response[1];
          for (var i = 0; i < articleList.length; i++) {
            articleStr = articleList[i];
            var url = 'https://en.wikipedia.org/wiki/' + articleStr;

            if(infowindow.marker != marker) {
              infowindow.marker = marker;
             infowindow.setContent('<div>' + marker.title + marker.content + '</div>' + '<li><a>' + url + '</a></li>');
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


