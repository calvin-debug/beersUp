// Gets a list of beers from the API
export async function getBeers(amount) {
  try {
    const response = await fetch(
      `https://random-data-api.com/api/beer/random_beer?size=${amount}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

/**
 * Sorts beer by style and returns a list of beer objects
 * @param {array} beers - The list of all beers.
 * @returns {array} An array of beers where each element represents a beer style. Each beer style object contains a list of beers with that style.
 */
export function sortBeersByStyle(beers) {
  // Create a dictionary to store the beer objects
  const beerStyles = {};
  // Initialize the counter for the group IDs
  let groupIdCounter = 0;

  const mergedBeers = mergeBeerLists(beers);

  // Iterate through the list of beers
  for (const beer of mergedBeers) {
    // Get the style of the current beer
    const style = beer.style;
    if (!beer.inOrder) beer.inOrder = false;

    // Check if an object for the current style already exists in the dictionary
    if (style in beerStyles) {
      // If it does, add the current beer to the allBeers list for that style
      beerStyles[style].beers.push(beer);
      beer.groupId = beerStyles[style].groupId;

      if (beer.inOrder) {
        beerStyles[style].groupInOrder = true;
      }
    } else {
      // If it doesn't, create a new object for the current style and add the current beer to its allBeers list
      beer.groupId = groupIdCounter;
      beerStyles[style] = {
        groupId: groupIdCounter,
        groupInOrder: beer.inOrder === true ? true : false,
        style: style,
        beers: [beer],
      };
      // Increment the group ID counter
      groupIdCounter++;
    }
  }

  // Return the dictionary as a list of objects
  return Object.values(beerStyles);
}

/**
 * This function finds the lowest alcohol beer in the given list of beers. Filtered by the "inOrder" parameter.
 * @param {array} beers - The list of all beers.
 * @param {boolean} fromOpenOrder - Whether to consider beers that have the "inOrder" property set to true or false.
 * @returns {object} The beer with the lowest alcohol percentage.
 */
export function findLowestAlcoholBeer(beers, fromOpenOrder) {
  const filteredBeers = beers.filter((beer) => beer.inOrder === fromOpenOrder);
  return filteredBeers.reduce((prev, current) => {
    // Convert the alcohol strings to numbers and compare them
    if (parseFloat(prev.alcohol) < parseFloat(current.alcohol)) {
      return prev;
    } else {
      return current;
    }
  });
}

function mergeBeerLists(newBeerList) {
  // Checking whether there is an open order in local storage with items in it
  let oldOpenOrder = JSON.parse(localStorage.getItem("openOrder"));
  if (!oldOpenOrder || oldOpenOrder.length === 0) {
    return newBeerList;
  }
  oldOpenOrder = oldOpenOrder.flatMap((group) => group.beers);

  // Creating the return list
  const mergedBeers = [...newBeerList];

  // Set "inOrder" property for each beer in the new list
  oldOpenOrder.forEach((oldBeer) => {
    const matchingBeer = mergedBeers.find((beer) => beer.name === oldBeer.name);
    if (matchingBeer) {
      // If the beer from local storage is already in the new beer list,
      // it doesn't need to be added to the list. Instead, just set the "inOrder" property to true.
      matchingBeer.inOrder = true;
    } else {
      // If the beer from local storage is not in the new beer list,
      // it needs to be added to the list with its "inOrder" property set to true.
      oldBeer.inOrder = true;
      mergedBeers.push(oldBeer);
    }
  });

  // Return the modified new list
  return mergedBeers;
}

export function getOpenOrder() {
  // Get the current open order from local storage
  const openOrder = localStorage.getItem("openOrder");
  if (!openOrder || openOrder.length === 0) return [];
  return JSON.parse(openOrder);
}
