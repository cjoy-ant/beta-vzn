// API source/key data
const API = [
  {
    //source: 'googleMaps',
    //apiKey: 'AIzaSyDylE853GqLUzIKstJZ-ZLoABfXaZ2T01Y',
    //searchURL: 'https://maps.googleapis.com/maps/api/geocode/json?'
    //source: 'radar',
    //key: 'prj_test_sk_af3f1b2b1f02bcacc30fe82515eb407fefeb30eb',
    //searchURL: 'https://api.radar.io/v1/geocode/forward'
    source: 'mapquest',
    key: 'oiX815Jb2u30RoL5uKEc8khC8tFZB6jE',
    searchURL: 'http://open.mapquestapi.com/geocoding/v1/address'
  },
  {
    source: 'mountainProject',
    key: '200138130-f4390060c061491452450bed66677057',
    searchURL: 'https://www.mountainproject.com/data/get-routes-for-lat-lon'
  },
  {
    source: 'youtube',
    //key: 'AIzaSyDylE853GqLUzIKstJZ-ZLoABfXaZ2T01Y',
    key: 'AIzaSyB-h0eBXMjN9EAO8nVifZkv3zh3QHuV7K8',
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
       <p>Use this app to search for boulders in an area and find videos to give you beta!</p>
    </div>
    `);
}

// generates html for about me page/section
function generateAboutPage() {
  console.log('Generating About Page');
  return `
    <div class="about">
      <h2>About</h2>
      <p>Description of this app.</p>
      <p>How to use this app</p>
      <p>Example screenshots of input/results</p>
    </div>
  `;
}

function generateSearchPage() {
  console.log('Generating Search Page');
  return `
    <div class="search">
      
      <h2>Need beta? Search for boulder problems</h2>
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
        <input type="number" name="max-results" id="js-max-results" min="1" max="10" placeholder="#">
        <p class="small">Enter a number 1-10</p>

        <input type="submit" name="search-button" id="search-btn" value="Search">
      </form>
      </div>

    <div class="error hidden">
      <p class="error-message" id="js-error-message"></p>
    </div>

    <div class="results hidden">
      <h2>Boulders & Beta</h2>
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

/********** API fetch functions **********/

// TO-DO:
    // create the request url utilizing format function
    // use location string as parameter
    // fetch data from geocoding/radar API (HOW TO FORMAT URL????)
    // SAMPLE REQUEST
    // curl "https://api.radar.io/v1/geocode/forward?query=20+jay+st+brooklyn+ny" \
    //   -H "Authorization: prj_live_pk_..."
    // push lat/lon data into [searchArray]
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
    .then(responseJson => pushToSearchArray(responseJson));
//    .catch(error => {
//      $('#js-error-message').text(`Something went wrong`)
//    });
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
//    .catch(error =>)
}

// pushes boulder information into their respective results arrays
function pushToResultsArray(responseJson) {
  console.log(responseJson);

  const numResults = $('#js-max-results').val();

  // if there are routes available in the location, push results to respective arrays
  if (responseJson.routes.length > 0) {
    // TO-DO: change back to i < numResults
    for (let i=0; i < 2; i++) {
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
    $('#js-error-message').text(`We couldn't find any boulder problems in that area. Try another search.`);
    $('.error').removeClass('hidden');
  }
}

// create request url utilizing format function
// use name, grade, and 'bouldering' as search queries
function getYoutubeVideos() {
  const numResults = $('#js-max-results').val();
  console.log('Searching for beta videos')

//  // TO-DO: change back to i < numResults
  for (let i=0; i < 2; i++) {
    // keeps track of what result it is on to be utilized as index for grabbing data from YouTube API response
    const name = nameArray[i];
    const grade = gradeArray[i];
    const q = name + '%20' + grade + '%20' + 'bouldering';

    const params = {
      key: API[2].key,
      // maxResults for videos defaulted to 3
      // TO-DO: change back to 3
      maxResults: 2
      };

    const queryString = formatYoutubeParams(params);
    const url = API[2].searchURL + '?' + queryString + '&q=' + q;
    
    // prints YouTube API request URL to the console
    console.log('YouTube GET request: ' + url);

    fetchVideosAndDisplayThem(url)
      .done(console.log(videosObj))
      .done(displayResults());
  }
//    fetch(url)
//      .then(response => response.json())
//      .then(responseJson => pushToVideosArray(responseJson));
//  }
//  console.log(videosObj);
//  displayResults();
}

function fetchVideosAndDisplayThem(url){
  fetch(url)
    .then(response => response.json())
    .then(responseJson => pushToVideosArray(responseJson));
}

//function loopAndFetchYoutubeVideos() {
//  // TO-DO: change back to i < numResults
//  for (let i=0; i < 2; i++) {
//    // keeps track of what result it is on to be utilized as index for grabbing data from YouTube API response
//    const name = nameArray[i];
//    const grade = gradeArray[i];
//    const q = name + '%20' + grade + '%20' + 'bouldering';
//    const params = {
//      key: API[2].key,
//      // maxResults for videos defaulted to 3
//      // TO-DO: change back to 3
//      maxResults: 2
//      };
//    const queryString = formatYoutubeParams(params);
//    const url = API[2].searchURL + '?' + queryString + '&q=' + q;
//    
//    // prints YouTube API request URL to the console
//    console.log('YouTube GET request: ' + url);
//    fetch(url)
//      .then(response => response.json())
//      .then(responseJson => pushToVideosArray(responseJson));
//  }
//}

// pushes youTube video links to videosArray
function pushToVideosArray(responseJson) {
  console.log(responseJson);
  counter.onResult++;
  console.log(`Pushing videos to videosObj[${counter.onResult}]`);

//  const numResults = $('#js-max-results').val();
  videosObj[counter.onResult] = [];

  for (let j=0; j < 2; j++) {
    const videoId = responseJson.items[j].id.videoId;
    console.log(`Video ${j+1}: https://www.youtube.com/watch?v=` + videoId);
    videosObj[`${counter.onResult}`].push(videoId);
  }
}

// TO-DO:
    // displays reults to the DOM
    // Each results will display:
    // name of boulder problem, grade, link to mountain project, [#] videos of the problem from youtube
    // NEED TO FIGURE OUT: How to display responses from multiple API sources
//function displayResults() {
//  const maxResults = $('#js-max-results').val();
//  console.log('Displaying Results');
//  if (responseJson === "0") {
//    $('#js-error-message').text(`Oops! Looks like there aren't any boulder problems in that area. 
//    Try another search.`);
//  }
//  else {
//    for (let i=0; i < maxResults; i++) {
//      $('#results-list').append(`
//      <li><h3>NAME OF BOULDER PROBLEM</h3>
//      <p>GRADE</p>
//      <p><a href="">LINK TO MOUNTAIN PROJECT PAGE</a></p>
//      <ul>
//        YOUTUBE VIDEOS
//      </ul>
//      </li>
//      `);
//    }
//  }
//}

// inputs html for each results into li in #results-list to display to the DOM
function displayResults() {
  console.log('Displaying results');
  $('.results').removeClass('hidden');
//  const numResults = $('#js-max-results').val();
//  const index = nameArray.length;

  // iterates through Mountain Project data from respective arrays and generates HTML for results
  // TO-DO: change back to i < numResults
  for (let i=0; i < 2; i++) {
    $('#results-list').append(`
    <li id="results-item-${i}"><h3>${nameArray[i]}</h3>
    <p>Grade: ${gradeArray[i]}</p>
    <p><a href="${linkArray[i]}" target="_blank">
    View this problem on Mountain Project</a></p>
    <h4>Beta Videos:</h4>
    </li>
    `);

    appendVideos(i);
  }
}

// iterates through Youtube video data from videosArray and appends <li> for each link to respective <ul>
// TO-DO: change back to i < 3 (will display 3 videos)
//    for (let i=0; i < 2; i++) {
//    //    $(`#video-${i}`).append(`<a href="${videosArray[i]}" target="_blank">Video ${i+1}</a>`)
//      $(`#results-item-${i}`).append(`
//          <p id='video-${i+1}'><a href="${videosArray[i]}" target="_blank">Video ${i+1}</a></p>`);
//    }

function appendVideos(i) {
//  const index = counter.onResult - 1;
  for (let j=0; j < 2; j++) {
  const videoId = videosObj[i][j];
  $(`#results-item-${i}`).append(`
    <p><a href="https://youtube.com/watch?v=${videoId}" 
    target="_blank">Video ${j+1}</a></p>`);
  }
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
  $('.error').addClass('hidden');
  $('#js-error-message').empty();
  $('.results').addClass('hidden');
  $('#results-list').empty();
  latArray.length = 0;
  lonArray.length = 0;
  nameArray.length = 0;
  gradeArray.length = 0;
  linkArray.length = 0;
  videosObj.length = 0;
  counter.onResult = -1;
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