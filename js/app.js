// Initialize variables
var starCount = 0,
    randomStar = 0,
    public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/15jI43rDdRkX1e2geGbrZjPyg82DKqKrBaP9lU5k21Zo/pubhtml',
    stars,
    playState = '-webkit-animation-play-state',
    $starBubble = $('#starBubble');
// Initialize tabletop js
var tabletop = Tabletop.init({
  key: public_spreadsheet_url,
  callback: sheetLoad,
  simpleSheet: false
});
// Hide star bubble info
$starBubble.css('display', 'none');
// Toggle parallax on
toggleParallax(true);

// Function to get star info from Google Docs Spreadsheet
function sheetLoad(data, tabletop){
  stars = data.stars.all();
  starCount = stars.length;
  console.log(stars);
  /*console.log(tabletop.data());
  console.log('Number of elements: ' + starCount);*/
}

// Function to render star info into stars-template using handlebars js
function render(context){
  var template = $("#stars-template").html();
  var compile = Handlebars.compile(template);
  var html = compile(context);
  $(".star-profiles").html( html ).show();
}

// Function to get a random star from the Googe Gocs Spreadsheet 
// Production version should have "coordinates" for each "star"
// to display the star info of the selected star
function getRandomStar(){
  var random = Math.floor(Math.random() * starCount) + 0;
  if (random == randomStar){
    getRandomStar();
  }
  else{
    randomStar = random;
  }
  console.log('Selected star: ' + randomStar);
  return randomStar;
}

// Function for when a "star" is clicked. 
function starClicked(e) {
  // Stop star animations
  toggleStarAnimation();
  // Stop parallax (Couldn't get this working =/ )
  toggleParallax(false);
  // Get a star
  var randomStar = getRandomStar();
  // Render star bubble
  render(stars[randomStar]);
  // Show star bubble info
  $starBubble.css( {
    position:"absolute", 
    display: "block"
  });
  // Position star bubble info where mouse was clicked
  $starBubble.css( { 
    top: e.clientY, 
    left: e.clientX
  });
}
// Function to toggle parallax with bool value
function toggleParallax(bool){
  // I decided to turn off the parallax feature because it was too distracting.
  // Maybe one day I'll turn it back on if I figure out how to freeze it when a star is clicked
  // And how to unfreeze when a star bubble modal is closed.
/*  $( ".parallax-layer" ).parallax({
      mouseport: $(".parallax-layer"),
      xparallax: bool,
      yparallax: bool
  });*/
}

// Function to toggle star animations
function toggleStarAnimation() {    
    $('#stars').css(playState, function(i, v) {
        return v === 'paused' ? 'running' : 'paused';        
    });      
    $('#stars2').css(playState, function(i, v) {
        return v === 'paused' ? 'running' : 'paused';        
    });   
    $('#stars3').css(playState, function(i, v) {
        return v === 'paused' ? 'running' : 'paused';        
    });  
    $('#background').css(playState, function(i, v) {
        return v === 'paused' ? 'running' : 'paused';        
    }); 
    $('#midground').css(playState, function(i, v) {
        return v === 'paused' ? 'running' : 'paused';        
    }); 
    $('#foreground').css(playState, function(i, v) {
        return v === 'paused' ? 'running' : 'paused';        
    }); 
} 

// Function to close star bubble info
function closeModal(){
  //e.preventDefault();
  if (event.defaultPrevented) return;
  $starBubble.fadeOut();
  toggleStarAnimation();
  toggleParallax(true);
  return;
}

// Pressed keys function
$(document).keyup(function(e) {
   if ((e.keyCode == 27) && 
   $starBubble.css("display") != "none") { // escape key maps to keycode `27`
      closeModal();
  }
});

// Clicked function
document.addEventListener("click", function(e) {
  // Close star bubble if the X image is clicked
  if($(e.target).is('img')){
    closeModal();
  } 
  // Show star bubble only if a "star" is clicked
  else if ($starBubble.css("display") == "none" && 
    !($(e.target).is('button')) &&
    !($(e.target).is("input")) &&
    !($(e.target).is("textarea"))){
    starClicked(e);
  }
}); 

// Submit function
$( "#starForm" ).on( "submit", function( event ) {
  // Preventing default for testing purposes only. 
  // In production, the submit button would post the results to the database.
  event.preventDefault();
  var $id = $("#starID");

  /* // Code below would be used in production to post results to the database.

  $id.val(starCount++);
  var formData = JSON.stringify($(this).serializeArray());
  console.log("Added star. New star count: " + starCount);
  console.log(formData);

  var data = JSON.parse(formData);*/

  // The newly "created" star is getting assigned a hard-coded ID for testing purposes.
  // Form values are getting directly from form and converted into
  // an object that tabletop js can read and render.
  $id.val(11);
  var $name = $("#name").val();
  var $description = $("#description").val();
  var data = {
     "id": $id,
     "name":$name,
     "description":$description
  }
  // Toggle star animation on.
  toggleStarAnimation();
  // Show star bubble roughly in the center of the screen.
 $starBubble.css({
        'position' : 'absolute',
        'left' : '40%',
        'top' : '50%'
    });
  console.log(data);
  render(data);

  // Once a star is "created" the form will fade out.
  // In production, the form should slide back down to its original position.
  $("#slideWrapper").fadeOut();

  // For testing purposes the whole page will reload after a star is "created".
  // In production, the star would be posted to the databse and the page would refresh.
  setTimeout(function(){
       location.reload();
  }, 3000);  
});













