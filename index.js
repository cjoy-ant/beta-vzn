// API source/key data
const API = [
    {
      source: 'mapquest',
      key: 'oiX815Jb2u30RoL5uKEc8khC8tFZB6jE',
      searchURL: 'https://open.mapquestapi.com/geocoding/v1/address'
    },
    {
      source: 'mountainProject',
      key: '200138130-f4390060c061491452450bed66677057',
      searchURL: 'https://www.mountainproject.com/data/get-routes-for-lat-lon'
    },
    {
      source: 'youtube',
      key: 'AIzaSyDylE853GqLUzIKstJZ-ZLoABfXaZ2T01Y',
      //key: 'AIzaSyB-h0eBXMjN9EAO8nVifZkv3zh3QHuV7K8',
      searchURL: 'https://www.googleapis.com/youtube/v3/search'
    },
  ];
  
  // data for Vgrade/difficulty drop down lists
const vGrade = {
  minimum: [
    'V0',
    'V1',
    'V2',
    'V3',
    'V4',
    'V5',
    'V6',
    'V7',
    'V8',
    'V9',
    'V10',
    'V11',
    'V12',
    'V13',
    'V14',
    'V15',
    'V16',
    'V17'
  ],
  maximum: [
    'V0',
    'V1',
    'V2',
    'V3',
    'V4',
    'V5',
    'V6',
    'V7',
    'V8',
    'V9',
    'V10',
    'V11',
    'V12',
    'V13',
    'V14',
    'V15',
    'V16',
    'V17'
  ]
};

//const searchArray = {
//  location: [],  
//  lat: [],
//  lon: []
//};

// SEARCH data
const locationArray = [];
//const geocodeObj = {
//    lat: [],
//    lon: []
//};
const latArray = [];
const lonArray = [];

// RESULTS data
const nameArray = [];
const gradeArray = [];
const linkArray = [];
// counts what # result it is on when iterating through mountain project response
const counter = {
    onResult: -1
}
const videosObj = {};

//const resultsArray = {
//  name: [],
//  grade: [],
//  link: [],
////  videos: []
//};

/********** HTML Generation Functions **********/
// generates html for start page
function generateHomePage() {
  $('main').html(`
    <div class="home">
       <h2>Welcome to BetaVzn!</h2>
       <p>Use this app to search for boulders in an area and find videos to give you beta.</p>
       <p class="medium">If this is your first time using BetaVzn, please head to the ABOUT page to learn how to use this app.</p>
       <h3>Climb on!</h3>
    </div>
    `);
}

// generates html for about me page/section
function generateAboutPage() {
  console.log('Generating About Page');
  return `
    <div class="about">
      <h2>About</h2>

      <p class="description">This is a rock climbing based app geared towards a particular discipline of climbing called 'bouldering'.
      Bouldering involves climbing up rock faces without wearing a harness or being attached to an anchor point via a climbing rope. 
      Bouldering is a more powerful, technical, and, arguably, a more dangerous form of rock climbing due to every fall being a ground fall.
      When climbing outside, climbers typically bring several crashpads to cushion their landing. 
      Climbers follow the designated route up to the top of the boulder, which is called "sending" a problem (short for 'ascend').</p>
      
      <p class="description">'Beta' is what we call an individual's solution, or movements used, to solve/send a boulder problem. 
      For example, a shorter climber may use different beta compared to a taller climber, such as stepping on higher footholds or grabbing onto smaller intermediate holds. 
      Finding the beta that works for you is an essential part of climbing and bouldering. 
      Sometimes getting beta from others in person or via videos can be an immense help, and that's where this app comes in!</p>
      <br>
    
      <h3>How to use this app</h3>
      <ul>
        <li>Enter a location (City, State)</li>
        <li>Choose the range of difficulty level you would like to search for by selecting the Minimum and Maximum Grade</li>
        <li>Enter a number 1-10 of how many results (boulder problems) you would like to populate</li>
        <li>Click 'Search'</li>
        <li>Each result will display the (1) Name of the problem (2) Grade (3) Link to the Mountain Project page, and (4) 2 YouTube Videos</li>
      </ul>

      <br>
      <p class="disclaimer">**Disclaimer: Data on boulder location and beta videos are dependent on, respectively, MapQuest and YouTube servers.
      Results displayed on this app will reflect what is readily available. Therefore, the videos may not always be relevant to the corresponding boulder problem.</p>
    </div>
  `;
}

function generateSearchPage() {
  console.log('Generating Search Page');
  return `
    <div class="search">
      
      <h2>Need beta?</h2>
      <h3>Search for boulder problems</h3>
      <br>
      <form class="search" id="search-form">
        <label for="search-location">Location: </label>
        <input type="text" name="search-location" id="js-search-location" placeholder="City, State" required>
        <p class="small">Example: Joshua Tree, CA</p>

        <label for="search-minDiff">Minimum Grade</label>
        <ul class="search" id="js-search-minDiff-list">
          <select class="search" name="search-minDiff" id="js-search-minDiff" required></select>
        </ul>

        <label for="search-maxDiff">Maximum Grade</label>
        <ul class="search" name="search-maxDiff" id="js-search-maxDiff-list">
          <select class="search" name="search-maxDiff" id="js-search-maxDiff" required></select>
        </ul>

        <br>
        <label for="max-results">Maximum number of Results to Show</label>
        <input type="number" name="max-results" id="js-max-results" min="1" max="10" value="1">
        <p class="small">Enter a number 1-10</p>

        <br>
        <input type="submit" name="search-button" id="search-btn" value="Search">
      </form>
    </div>

    <div class="error hidden" id="error-container">
      <p class="error-message" id="js-error-message"></p>
    </div>

    <div class="results hidden">
      <h2 id="results-header">Boulders & Beta</h2>
      <ul id="results-list">
      </ul>
    </div>

    `;
}

// generates html for drop down list for min/max grades
function generateGradeList() {
  for (let i=0; i < vGrade.minimum.length; i++) {
    $('#js-search-minDiff').append(`
    <option id="${vGrade.minimum[i]}" value="${vGrade.minimum[i]}">${vGrade.minimum[i]}</option>
    `);
  }
  for (let i=0; i < vGrade.maximum.length; i++) {
    $('#js-search-maxDiff').append(`
    <option id="${vGrade.maximum[i]}" value="${vGrade.maximum[i]}">${vGrade.maximum[i]}</option>
    `);
  }
}

/********** Format Query Parameter Functions **********/
function formatGeocodingParams(params) {
  const gmQueryItems = Object.keys(params).map(key=> 
    `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return gmQueryItems.join('&');
}

function formatMountainProjectParams(params) {
  const mpQueryItems = Object.keys(params).map(key=> 
    `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return mpQueryItems.join('&');
}

function formatYoutubeParams(params) {
  const ytQueryItems = Object.keys(params).map(key=> 
    `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return ytQueryItems.join('&');
}

function formatYoutubeSearch(params) {
  const ytSearchQueryItems = Object.keys(params).map(key=> 
    `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return ytSearchQueryItems.join('+');
}

/********** API fetch functions **********/

// inputs location into mapquest API to geocode location into lat/lon data
function getLocationGeocode() {
  const location = $('#js-search-location').val();
  const params = {
    key: API[0].key,
    location: location
    };

  const queryString = formatGeocodingParams(params);
  const url = API[0].searchURL + '?' + queryString;

  // prints the MapQuest API request to the console
  console.log('MapQuest GET request: ' + url);
  console.log('Geocoding your location')
  
  fetch(url)
    .then(response => response.json())
    .then(responseJson => pushToSearchArray(responseJson))
    .catch(error => {
      $('#js-error-message').text(`Something went wrong. ${error.message}`);
      $('#error-container').removeClass('hidden');
      });
}

// pushes lat lon data from mapquests API
function pushToSearchArray(responseJson) {
  console.log(responseJson);

  const location = $('#js-search-location').val();
  const lat = $(responseJson.results[0].locations[0].latLng.lat);
  const lon = $(responseJson.results[0].locations[0].latLng.lng);

  latArray.push(lat);
  lonArray.push(lon);

  console.log(`Location: ${location} [Latitude: ${latArray[0][0]}, Longitude: ${lonArray[0][0]}]`);

  getRoutesLatLon();
}

// lat => latArray[0][0]
// lon => lonArray[0][0]

// TO-DO:
    // create request url utilizing format function
    // use lat, lon, minDiff, maxDiff as parameters
    // fetch data from Mountain Project API
    // WILL NEED TO PUSH DATA for name, grade, mountain project link to [resultsArray]
function getRoutesLatLon() {
  const minDiff = $('#js-search-minDiff option:selected').val();
  const maxDiff = $('#js-search-maxDiff option:selected').val();
  const params = {
    key: API[1].key,
    lat: latArray[0][0],
    lon: lonArray[0][0],
    minDiff: minDiff,
    maxDiff: maxDiff
    };

  const queryString = formatMountainProjectParams(params);
  const url = API[1].searchURL + '?' + queryString;

  // prints the Mountain Project API request URL to the console
  console.log('Mountain Project GET request: ' + url);
  console.log('Searching for boulder problems');

  fetch(url)
    .then(response => response.json())
    .then(responseJson => pushToResultsArray(responseJson))
    .catch(error => {
      $('#js-error-message').text(`Something went wrong: ${error.message}`);
      $('').removeClass('hidden');
    });
}

// pushes boulder information into their respective results arrays
function pushToResultsArray(responseJson) {
  console.log(responseJson);

  const numResults = $('#js-max-results').val();

  // if there are routes available in the location, push results to respective arrays
  if (responseJson.routes.length > 0) {
    // TO-DO: change back to i < numResults
    for (let i=0; i < numResults; i++) {
      nameArray.push(responseJson.routes[i].name);
      gradeArray.push(responseJson.routes[i].rating);
      linkArray.push(responseJson.routes[i].url);
    };
    
    console.log('Boulder names: ' + nameArray);
    console.log('Grades: ' + gradeArray);
    console.log('Mountain Project links: ' + linkArray);

    getYoutubeVideos();
//    displayResults();
  }
  else {
    // if there are no routes that match the search criteria, display error message
    $('#js-error-message').text(`We couldn't find any boulder problems in that area. Try another search. 
    **TIP: make sure your location is formatted like the example.`);
    $('#error-container').removeClass('hidden');
  }
}

// create request url utilizing format function
// use name, grade, and 'bouldering' as search queries
function getYoutubeVideos() {
  const numResults = $('#js-max-results').val();
  console.log('Searching for beta videos');

  // TO-DO: change back to i < numResults
  for (let i=0; i < numResults; i++) {
    // keeps track of what result it is on to be utilized as index for grabbing data from YouTube API response
    const name = nameArray[i];
    const grade = gradeArray[i];
    const q = name + '%20' + grade + '%20' + 'bouldering';

    const params = {
      key: API[2].key,
      // maxResults for videos defaulted to 3
      // TO-DO: change back to 3
      maxResults: 3
      };

    const queryString = formatYoutubeParams(params);
    const url = API[2].searchURL + '?' + queryString + '&q=' + q;
    
    // prints YouTube API request URL to the console
    console.log('YouTube GET request: ' + url);

    fetch(url)
      .then(response => response.json())
      .then(responseJson => pushToVideosArray(responseJson, i))
      .catch(error => {
        $('#js-error-message').text(`Something went wrong: ${error.message}`);
        $('#error-container').removeClass('hidden');
      });
  }
}

// pushes youTube video links to videosArray
function pushToVideosArray(responseJson, i) {
  console.log(responseJson);
  console.log(`Pushing videos to videosObj[${i}]`);

//  const numResults = $('#js-max-results').val();
  videosObj[i] = [];

  // j < (number of videos to list)
  for (let j=0; j < 3; j++) {
    const videoId = responseJson.items[j].id.videoId;
    console.log(`Video ${j+1}: https://www.youtube.com/watch?v=` + videoId);
    videosObj[`${i}`].push(videoId);
  }
  displayResults(i);
}

// inputs html for each results into li in #results-list to display to the DOM
function displayResults(i) {
  console.log('Displaying results');
  $('.results').removeClass('hidden');
//  const numResults = $('#js-max-results').val();
//  const index = nameArray.length;

  // iterates through Mountain Project data from respective arrays and generates HTML for results
  // TO-DO: change back to i < numResults
//    for (let i=0; i < 2; i++) {
    $('#results-list').append(`
    <li id="results-item-${i}"><h3 class="name">${nameArray[i]}</h3>
    <p class="grade">Grade: ${gradeArray[i]}</p>
    <p class="link"><a href="${linkArray[i]}" target="_blank">
    View this problem on Mountain Project</a></p>
    <h4 class="video">Beta Videos:</h4>
    </li>
    `);

    appendVideos(i);
//    }
}

// iterates through Youtube video data from videosArray and appends <li> for each link to respective <ul>
// TO-DO: change back to i < 3 (will display 3 videos)
//function appendVideos(i) {
////  const index = counter.onResult - 1;
//// j < (number of videos to list)
//  for (let j=0; j < 3; j++) {
//  const videoId = videosObj[i][j];
//  $(`#results-item-${i}`).append(`
//    <p class="video"><a href="https://youtube.com/watch?v=${videoId}" 
//    target="_blank">Video ${j+1}</a></p>`);
//  }
//}
// embeds youtube video into html and displays to DOM
function appendVideos(i) {
  //  const index = counter.onResult - 1;
  // j < (number of videos to list)
  for (let j=0; j < 2; j++) {
  const videoId = videosObj[i][j];
    $(`#results-item-${i}`).append(`
    <iframe class="video" id="video-${i}${j}" src="https://www.youtube.com/embed/${videoId}">
    </iframe>
    `
    )};

  const ytSearchURL = 'https://www.youtube.com/results';
  const name = nameArray[i];
  const grade = gradeArray[i];
  const location = $('#js-search-location').val();
  const params = {
    search_query: name + ' ' + grade + ' ' + 'bouldering' + ' ' + location
    };
  const queryString = formatYoutubeSearch(params);
  const url = ytSearchURL + '?' + queryString;

  // Example: https://www.youtube.com/results?search_query=Emerald+City+V0+PG13+bouldering+joshua+tree%2C+ca
  $(`#results-item-${i}`).append(`
  <p class"link"><a href="${url}" target="_blank">Find more beta videos on YouTube</a></p>
  `);
}

/********** Event Listener Functions **********/
// listens for when user clicks #home-page-btn in nav
function handleHomePage() {
  $('#home-page-btn').click(event => {
      console.log('Home Page clicked');
      event.preventDefault();
      $('main').html(generateHomePage());
  });
}
  
  // listens for when user clicks onf #about-page-btn in nav
  function handleAboutPage() {
    $('#about-page-btn').click(event => {
      console.log('About Page clicked');
      event.preventDefault();
      $('main').html(generateAboutPage());
    });
  }
  
  // listens for when user clicks on #search-page-btn in nav
  function handleSearchPage() {
    $('#search-page-btn').click(event => {
      console.log('Search Page clicked');
      event.preventDefault();
      $('#results-list').empty();
      $('main').html(generateSearchPage());
      generateGradeList();
      handleSubmit();
    });
  }
  
  // listens for the user clicks #search-btn to submit form.search
  // TO-DO:
      // add GET functions to run when SEARCH is clicked
  function handleSubmit() {
    $('form').submit(event => {
      event.preventDefault();
      emptyData();
      console.log('Searching');
      const locationString = $('#js-search-location').val();
      locationArray.push(locationString);
      getLocationGeocode();
  //      .then(results => displayResults(results));
    });
  }
  
  // empties the error-message and arrays holding information from previous search
  function emptyData() {
    $('#error-container').addClass('hidden');
    $('#js-error-message').empty();
    $('.results').addClass('hidden');
    $('#results-list').empty();
    latArray.length = 0;
    lonArray.length = 0;
    nameArray.length = 0;
    gradeArray.length = 0;
    linkArray.length = 0;
    videosObj.length = 0;
  }
  
  /********** Initializing Function **********/
  function runApp() {
    generateHomePage();
    handleHomePage();
    handleAboutPage();
    handleSearchPage();
    handleSubmit();
  }
  
  $(runApp)