// Gets a list of beers from the API
async function getBeers(amount) {
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
function sortBeersByStyle(beers) {
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
 * Gets a list of beers from the API and sorts them by style.
 * @param {number} amount - Amount of beers to fetch from the API.
 * @returns {object} A list of beer objects where each element represents a beer style. Each beer style object contains a list of beers with that style.
 */
export async function getAndSortBeers(amount) {
  return getBeers(amount).then((beers) => sortBeersByStyle(beers));
}

/**
 * Finds the lowest alcohol beer in the given list of beers. Filtered by the "inOrder" parameter.
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

function addLowestAlcoholBeerToOrder(group) {
  findLowestAlcoholBeer(group.beers, false).inOrder = true;
}

function removeLowestAlcoholBeerFromOrder(group) {
  findLowestAlcoholBeer(group.beers, true).inOrder = false;
}

/**
 * Changes the "groupInOrder" property of the beer group with the given ID based on the "remove" argument.
 * @param {array} beers - The list of all beers groups.
 * @param {number} groupId - Group ID of the beer group to change.
 * @param {boolean} remove - Whether or not to remove the beer group from the order.
 * @returns {array} The list of all beers groups with the changed beer group.
 */
export function changeGroupState(beers, groupId, remove) {
  const beerGroups = [...beers];
  const beerGroup = beerGroups.find((group) => group.groupId === groupId);
  if (!remove) beerGroup.groupInOrder = true;
  else beerGroup.groupInOrder = false;

  return beerGroups;
}

/**
 * Changes the order list of the beer group with the given ID based on the "remove" argument.
 * If the "remove" argument is true, the lowest alcohol beer in the group that is in the order will be removed from the order.
 * If the "remove" argument is false, the lowest alcohol beer in that is not in the order the group will be added to the order.
 * @param {array} beers - The list of all beers groups.
 * @param {number} groupId - Group ID of the beer group to change.
 * @param {boolean} remove - Whether to remove a beer from the group order or to add one.
 * @returns {array} The list of all beers groups with the changed beer group.
 */
export function changeGroupOrder(beers, groupId, remove) {
  const beerGroups = [...beers];
  const beerGroup = beerGroups.find((group) => group.groupId === groupId);
  if (!remove) addLowestAlcoholBeerToOrder(beerGroup);
  else removeLowestAlcoholBeerFromOrder(beerGroup);

  // Check if the group has any beers that are "inOrder"
  // If not, then set the group to not be in the order, as an empty group
  // should not be in the order.
  const groupHasBeersInOrder = beerGroup.beers.some((beer) => beer.inOrder);
  if (!groupHasBeersInOrder) beerGroup.groupInOrder = false;

  return beerGroups;
}

/**
 * Changes the "inOrder" property of the beer with the given ID based on the "remove" argument.
 * If after removing, no beers are left in the group order, the group will be removed from the order.
 * @param {array} beers - The list of all beers groups.
 * @param {number} groupId - Group ID of the beer group to change.
 * @param {boolean} remove - Whether to add the beer to the group order or to remove it.
 * @returns {array} The list of all beers groups with the changed beer group.
 */
export function changeBeerState(beers, beerId, remove) {
  const beerGroups = [...beers];
  const allBeers = beerGroups.flatMap((group) => group.beers);
  const beer = allBeers.find((beer) => beer.id === beerId);
  beer.inOrder = remove;

  // Check if the group has any beers that are "inOrder"
  // If not, then set the group to not be in the order, as an empty group
  // should not be in the order.
  const groupId = beer.groupId;
  const beerGroup = beerGroups.find((group) => group.groupId === groupId);
  const groupHasBeersInOrder = beerGroup.beers.some((beer) => beer.inOrder);
  if (!groupHasBeersInOrder) beerGroup.groupInOrder = false;

  return beerGroups;
}

/**
 * Gets the current open order from local storage.
 * @returns {array} The current open order.
 */
export function getOpenOrderFromLocalStorage() {
  // Get the current open order from local storage
  const openOrder = localStorage.getItem("openOrder");
  if (!openOrder || openOrder.length === 0) return [];
  return JSON.parse(openOrder);
}

/**
 * Gets all previous orders from local storage.
 * @returns {array} All previous orders.
 */
export function getAllOrdersFromLocalStorage() {
  // Get all orders from local storage
  const allOrders = localStorage.getItem("allOrders");
  if (!allOrders || allOrders.length === 0) return [];
  return JSON.parse(allOrders);
}

export function getOpenOrder(beers) {
  // Get all groups that are added to the order
  const inOrderGroups = beers.filter((group) => group.groupInOrder);
  // Filter out all beers that are not added to the order
  const filteredGroups = inOrderGroups.map((group) => {
    const filteredBeers = group.beers.filter((beer) => beer.inOrder);
    return { ...group, beers: filteredBeers };
  });
  const nonEmptyGroups = filteredGroups.filter(
    (group) => group.beers.length > 0
  );
  return nonEmptyGroups;
}
