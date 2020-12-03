// API source/key data
const API = [
  {
    //source: 'googleMaps',
    //apiKey: 'AIzaSyDylE853GqLUzIKstJZ-ZLoABfXaZ2T01Y',
    //searchURL: 'https://maps.googleapis.com/maps/api/geocode/json?'
    source: 'radar',
    key: 'prj_test_sk_af3f1b2b1f02bcacc30fe82515eb407fefeb30eb',
    searchURL: 'https://api.radar.io/v1/geocode/forward'
  },
  {
    source: 'mountainProject',
    key: '200138130-f4390060c061491452450bed66677057',
    searchURL: 'https://www.mountainproject.com/data/get-routes-for-lat-lon'
  },
  {
    source: 'youtube',
    key: 'AIzaSyDylE853GqLUzIKstJZ-ZLoABfXaZ2T01Y',
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

const resultsArray = {
    geocode: [],
    name: [],
    grade: [],
    link: []
}

/********** HTML Generation Functions **********/
// generates html for start page
function generateHomePage() {
  $('main').html(`
    <div class="start-page">
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

function generateSearchForm() {
  console.log('Generating Search Form');
  return `
    <div class="container">

    <h2>Need beta? Search for boulder problems</h2>

    <form class="search">
      <label for="search-location">Location: </label>
      <input type="text" name="search-location" id="js-search-location" placeholder="Enter a Location..." required>
      <br>
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
      <input type="number" name="max-results" id="js-max-results" value="10">
      <br>
      <input type="submit" name="search-button" id="search-btn" value="Search">
    </form>

    <section class="error">
      <p class="error-message" id="js-error-message"></p>
    </section>

    <section class="results">
      <h2></h2>
      <ul id="results-list">
      </ul>
    </section>

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
function getLocationGeocode() {
  const location = $('input[type=text]').val();
  let params = {
    key: API[0].key,
    q: location,
  }

  let queryString = formatGeocodingParams(params);


}

function getRoutesLatLon() {
  const minDiff = $('#js-search-minDiff option:selected').val();
  const maxDiff = $('#js-search-maxDiff option:selected').val();
  const params = {
    key: API[1].key,
    lat: geocode[0],
    lon: geocode[1],
    minDiff: minDiff,
    maxDiff: maxDiff
    };

  const queryString = formatMountainProjectParams(params);
  const url = API[1].searchURL + '?' + queryString

  console.log(url);
  console.log('Searching for boulder problems')

  fetch(url)
    .then(response => response.json())
}

function getYoutubeVideos() {
  const name = resultsArray.name;
  const grade = resultsArray.grade;
  const q = name + '%20' + grade + '%20' + 'bouldering';

  const params = {
    key: API[2].key,
    maxResults: $('input[type:number][id:js-max-results]').val()
  };

  let queryString = formatYoutubeParams(params);
  const url = API[2].searchURL + '?' + queryString + '&q=' + q;

  console.log(url);
  console.log('Searching for beta videos');

  fetch(url)
    .then(response => response.json());
}

function displayResults(responseJson) {
  console.log()
}

/********** Event Listener Functions **********/
// listens for user to click search button
function handleHomePage() {
  $('#home-page-btn').click(event => {
      console.log('Home Page clicked')
      event.preventDefault();
      $('main').html(generateHomePage());
  });
}

function handleAboutPage() {
  $('#about-page-btn').click(event => {
    console.log('About Page clicked')
    event.preventDefault();
    $('main').html(generateAboutPage());
  });
}

function handleSearchForm() {
  $('#search-page-btn').click(event => {
    console.log('Search Form clicked')
    event.preventDefault();
    $('main').html(generateSearchForm());
    generateGradeList();
  })
}

function handleSubmit() {
  $('#search-btn').click(event => {
    console.log('Searching');
    event.preventDefault();
    getYoutubeVideos();
  });
}

/********** Initializing Function **********/
function runApp(){
  generateHomePage();
  handleHomePage();
  handleAboutPage();
  handleSearchForm();
  handleSubmit();
}

$(runApp())