const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (errro) => {
        alert("Location permission denied or error occurred.")
      console.error(errro);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "ashwani yadav",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  if (id === socket.id) {
    map.setView([latitude, longitude]);
  }

  if (!markers[id]) {
    console.log(markers[id]);
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  } else {
    console.log(
      markers[id],
      "   -------------------------",
      latitude,
      longitude
    );
    markers[id].setLatLng([latitude, longitude]);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
