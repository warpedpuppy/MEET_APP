import { mockData } from './mock-data';
import axios from 'axios';
import NProgress from 'nprogress';
import Config from './config';
import lastEvents from './lastEvents.json'

export const extractLocations = (events) => {
  var extractLocations = events.map((event) => event.location);
  var locations = [...new Set(extractLocations)];
  return locations;
};

function setTest () {
  const locationsX = ["Santiago, Santiago Metropolitan Region, Chile","California, USA","Bangkok, Thailand","Berlin, Germany","Cape Town, South Africa","New York, NY, USA","Mumbai, Maharashtra, India","London, UK","Amsterdam, Netherlands","Dubai - United Arab Emirates","Toronto, ON, Canada","Tokyo, Japan","Nairobi, Kenya","Sydney NSW, Australia","Moscow, Russia"];
  localStorage.setItem('lastEvents', JSON.stringify(lastEvents));
  localStorage.setItem('locations', JSON.stringify(locationsX));
}

export const getEvents = async () => {
  NProgress.start();

  // local host will only show mockData, all other endpoints (gh-pages) will show full api
  setTest();
  // if (window.location.href.startsWith('http://localhost')) {
  //   NProgress.done();
  //   return mockData;
  // }

  // offline ability to load old data
  if (!navigator.onLine) {
    console.log('offline!')
    const storedEvents = localStorage.getItem('lastEvents');
    NProgress.done();
    return JSON.parse(storedEvents).events;
  }

  const token = await getAccessToken();

  if (token) {
    removeQuery();
    const url = Config.GET_EVENTS + token;
    const result = await axios.get(url);
    if (result.data) {
      var locations = extractLocations(result.data.events);
      localStorage.setItem('lastEvents', JSON.stringify(result.data));
      localStorage.setItem('locations', JSON.stringify(locations));
    }
    NProgress.done();
    return result.data.events;
  }
};

const removeQuery = () => {
  if (window.history.pushState && window.location.pathname) {
    var newurl =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname;
    window.history.pushState('', '', newurl);
  } else {
    newurl = window.location.protocol + '//' + window.location.host;
    window.history.pushState('', '', newurl);
  }
};

export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck.error) {
    await localStorage.removeItem('access_token');
    const searchParams = new URLSearchParams(window.location.search);
    const code = await searchParams.get('code');
    if (!code) {
      const results = await axios.get(Config.GET_AUTH);
      const { authUrl } = results.data;
      return (window.location.href = authUrl);
    }
    return code && getToken(code);
  }
  return accessToken;
}

export const checkToken = async (accessToken) => {
  const result = await fetch(
    `${Config.GOOGLE_API}access_token=${accessToken}`
  )
    .then((res) => res.json())
    .catch((error) => error.json());

  return result;
}

const getToken = async (code) => {
  removeQuery();
  const encodeCode = encodeURIComponent(code);
  const { access_token } = await fetch(
    Config.GET_TOKEN + encodeCode
  )
    .then((res) => {
      return res.json();
    })
    .catch((error) => error);

  access_token && localStorage.setItem('access_token', access_token);

  return access_token;
};





