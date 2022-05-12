const busStops = []
mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ0dXJvc29iZXJhbmVzIiwiYSI6ImNsMnpuaHE2bzBvb2QzYm93M3IyOWZwNTAifQ.o6ygyjfGXMzEZSfo8_jS1Q';
let position = true;

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-71.104081, 42.365554],
  zoom: 14,
});

let marker = new mapboxgl.Marker()
    .setLngLat([-71.093729, 42.359244])
    .addTo(map)

let counter = 0;
function move() {
  if(counter < busStops.length){
    marker.setLngLat(busStops[counter]);
    counter++
  }else{
    counter = 0;
  }
}

async function getPosition(){
  if (position){
    const locations = await getBusLocations();
    locations.forEach((item) =>{
      let arrLocation = [item.attributes.longitude, item.attributes.latitude];
      busStops.push(arrLocation);
    });
    position = false;
    return true;
  }
}

// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}

async function run(){
  let func = await getPosition()
  if(func){
    setInterval(move, 1000);
  }
}
run()

