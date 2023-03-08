// TODO: Add credit here...
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

// TODO: Add comments here 
// institution = { location_latitude: xx, location_longitude: xx }
// listings = [ { listing object }, { listing object }, { listing object }, ... ]
function getListingsNearInstitution(institution, listings, maxDistance=100) {
  let nearbyListings = [];

  listings.forEach((listing) => {
    let distanceInKm = getDistanceFromLatLonInKm(
      institution.locationLatitude, 
      institution.locationLongitude,
      listing.listingLatitude,
      listing.listingLongitude
    );

    if(distanceInKm <= maxDistance) {
      nearbyListings.push(listing);
    }

  });

  return nearbyListings;
}

module.exports = getListingsNearInstitution;