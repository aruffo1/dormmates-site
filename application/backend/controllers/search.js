const Search = require('../models/search');
const Photo = require('../models/photo');
const fetch = require('node-fetch');
// const User = require('../models/user');

// ----------------------------------------------------------------
// This function takes in a name paremeter and returns all institutions 
// in the system that have that parameter in their name.
// Returns: 
//      200 if successful, 400 if something went wrong
//      JSON with a message and institutions fields
// ----------------------------------------------------------------
const getInstitutions = async function (req, res, next) {
  // Get the search query
  const name = req.params.name;

  // Validate search query
  if (!name) {
    return res.status(400).send({
      message: 'Name parameter is required'
    });
  } else if (name.length < 3) {
    return res.status(400).send({
      message: 'Name parameter must be at least 3 characters long'
    });
  }

  // return the search query
  const institutions = await Search.getInstitutionsByName(name)
  return res.status(200).send({
    message: `Successfully retrieved all institutions with '${name}' in their name.`,
    institutions: institutions
  });
}

/**************************************************************************
 * This function is designed to filter the listing search options
 * By taking in query parameters of amenities and return all listings
 * that match the query parameters.
 * Returns:
 *    200 if success, 
 *    400 if failure to process the request with an error message
 *************************************************************************/

 const getListingsByAmenities = async function (req, res, next) {
  //map of amenities 
  let amenities = {
    washer: req.query.washer,
    dryer: req.query.dryer,
    wifi: req.query.wifi,
    closet: req.query.closet,
    furnished: req.query.furnished,
    kitchen: req.query.kitchen,
    bath: req.query.bath,
    livingroom: req.query.livingroom,
    patio: req.query.patio,
    parking: req.query.parking
  };

  // Validating filters
  for (const [key, value] of Object.entries(amenities)) {
    if (typeof value === 'undefined') {
      delete amenities[key];
      continue;
    }
    //compare values as 1 and 0 for tiny int in databse but string for url
    if (!(value === '1' || value === '0')) {
      return res.status(200).send({
        error: 'needs to be either a query value of 1 or 0'
      });
    }
  }

  try {
    // Search for listings that match the given amenities
    const listings = await Search.getListingsByAmenities(amenities);
    
    for(let i = 0; i < listings.length; i++) {
      const listing = listings[i];
      const photos = await Photo.GetPhotosByListingId(listing.id);
      listings[i].photos = photos;
    } 

    return res.status(200).send({
      listings: listings
    });
  } catch (error) {
    return res.status(400).send({
      message: 'Error in the request'
    });
  }
}


/************************************************************************
 * This function is designed to be used to filter a search for 
 * student users by using query parameters. It searches the database
 * any students that have the same parameters that match their attributes
 * Returns:
 * 200 if the request is successful
 * 400 if the request is unsuccessful
 ***********************************************************************/


 const getRoommateByFiltering = async function (req, res, next) {
  //map of roommate filter options with a validation check to see if the values are not null 
  let filters = {
    major: req.query.major,
    personality: req.query.personality,
    hobby1: req.query.hobby1,
    hobby2: req.query.hobby2,
    schedule: req.query.schedule
  };

  //map of majors
  let majors = {
    computerScience: 'computer science',
    physic: 'physic',
    mathematic: 'mathematic',
    biology: 'biology',
    businessManagement: 'business management',
    business: 'business',
    accounting: 'accounting',
    nursing: 'nursing',
    psychology: 'psychology',
    communication: 'communication',
    marketing: 'marketing',
    generalEducation: 'general education',
    elementaryEducation: 'elementary education',
    finance: 'finance',
    criminalJustice: 'criminal justice',
    politicalScience: 'political science',
    economics: 'economics',
    electricalEngineering: 'electrical engineering',
    history: 'history',
    liberalArts: 'liberal arts',
    sociology: 'sociology'
  };

  //map of personalities
  let personalities = {
    architect: 'architect',
    logician: 'logician',
    commander: 'commander',
    debater: 'debater',
    advocate: 'advocate',
    mediator: 'mediator',
    protagonist: 'protagonist',
    campaigner: 'campaigner',
    logistician: 'logistician',
    defender: 'defender',
    executive: 'executive',
    consul: 'consul',
    virtuoso: 'virtuoso',
    adventurer: 'adventurer',
    entrepreneur: 'entrepreneur',
    entertainer: 'entertainer'
  };

  //map of hobbies 
  let hobbies = {
    music: 'music',
    food: 'food',
    readingWriting: 'reading and writing',
    travel: 'traveling',
    pets: 'pets',
    cooking: 'cooking',
    healthFitness: 'health and fitness',
    socializing: 'socializing',
    sports: 'sports',
    artsCrafts: 'arts and crafts',
    filmTv: 'film and television',
    photography: 'photography',
    dancing: 'dancing',
    technology: 'technology',
    gaming: 'gaming',
    gardening: 'gardening',
    beauStyFashion: 'beauty and fashion',

  };

  //map of schedules
  let schedules = {
    daytime: 'daytime',
    afternoon: 'afternoon',
    nighttime: 'nighttime'
  };
  
  

  //validation of all the map values
  for (const [key, value] of Object.entries(filters)) {
    if (key === 'major') {
      if (typeof value === 'undefined') {
        delete filters[key];
      }
      else if (majors[value] !== 'undefined') {
        filters[key] = majors[value];
      } else {
        return res.status(404).status({
          error: 'Invalid major provided'
        })
      }
    }
    else if (key === 'personality') {
      if (typeof value === 'undefined') {
        delete filters[key];
      }
      else if (personalities[value] !== 'undefined') {
        filters[key] = personalities[value];
      } else {
        return res.status(404).status({
          error: 'Invalid personality provided'
        });
      }
    }
    else if (key === 'schedule') {
      if (typeof value === 'undefined') {
        delete filters[key];
      }
      else if (schedules[value] !== 'undefined') {
        filters[key] = schedules[value];
      } else {
        return res.status(404).status({
          error: 'Invalid schedule provided'
        });
      }
    }
    else if (key === 'hobby1') {
      if (typeof value === 'undefined') {
        delete filters[key];
      }
      else if (hobbies[value] !== 'undefined') {
        filters[key] = hobbies[value];
      } else {
        return res.status(404).status({
          error: 'Invalid hobby provided'
        });
      }
    }
    else if (key === 'hobby2') {
      if (typeof value === 'undefined') {
        delete filters[key];
      }
      else if (hobbies[value] !== 'undefined') {
        filters[key] = hobbies[value];
      } else {
        return res.status(404).status({
          error: 'Invalid hobby provided'
        });
      }
    }
  }
  try {
    const students = await Search.getRoommatesByFiltering(filters,req.user.student.institutionID,req.user.uuid)
    return res.status(200).send({
      students
    });

  } catch (error) {
    return res.status(400).send({
      message: 'Error in the request'
    });
  }
}

/****************************************************************
 * This function is used to provide recommended roommate options
 * for a student in their dashboard. It searches for students 
 * that have matching institutions and displays 5 random students 
 * that do.
 * Returns:
 *    200 if successful
 *    400 if unable to find recommendations or unsuccessful request
 ****************************************************************/
const getRoommateRecomendations = async function (req, res, next) {
  const studentId = req.params.id;
  if (!studentId) {
    return res.status(400).send({
      message: 'Unable to find recommendations'
    });
  }
  try {
    const students = await Search.getRoommatesRecomendations(studentId)
    return res.status(200).send({
      students: students
    });
  } catch (error) {
    {
      return res.status(400).send({
        message: 'Error in the request'
      });
    }
  }
}

/****************************************************************
 * This function is used to get meta data about a given location
 * such as lon, lat, county, etc...
 * Returns:
 *    200 if successful
 *    400 if unable to find a location or unsuccessful request
 ****************************************************************/
const getLocationData = async function (req, res, next) {
  const POSITION_STACK_KEY = '4c132ddcbbe20dae472cf49a67ce544c';
  const POSITION_STACK_BASE = `http://api.positionstack.com/v1/forward?access_key=${POSITION_STACK_KEY}`
  const location = req.params.location;
  
  if (!location) {
    return res.status(400).send({
      error: 'No location provided'
    });
  }

  // Using the position stack API to get
  fetch(`${POSITION_STACK_BASE}&query=${location}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then((response) => response.json())
  .then((response) => {
    let data = response.data.filter((data) => {
      return data.region_code === 'CA';
    });
    res.status(200).send({
      error: data.length === 0 ? 'Invalid location provided.' : null,
      data: data
    });
  })
  .catch((error) => {
    res.status(400).send({
      message: error,
      error: 'Unable to find location'
    });
  })
}


module.exports = {
  getInstitutions,
  getListingsByAmenities,
  getRoommateByFiltering,
  getRoommateRecomendations,
  getLocationData
};