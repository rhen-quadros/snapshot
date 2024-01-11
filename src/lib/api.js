const url =
  "https://mainnet.helius-rpc.com/?api-key=45c66c7d-affb-4a5d-a5d6-3639fe81a4f1";
const marketplaceAddress = [
  "4zdNGgAtFsW1cQgHqkiWyRsxaAgxrSRRynnuunxzjxue",
  "1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix",
];

const getAssetsByGroup = async (creatorAddress, marketplace, traitValue) => {
  let page = 1;
  let hasMoreResults = true;
  let allHolders = [];
  let unlistedHolders = [];
  let traitMatchHolders = [];

  while (hasMoreResults) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-id",
        method: "getAssetsByGroup",
        params: {
          groupKey: "collection",
          groupValue: creatorAddress,
          page,
          limit: 1000,
        },
      }),
    });

    const { result } = await response.json();

    if (result.items.length === 0 && page === 1) {
      // If there are no results in the first page, call getAssetsByCreator
      return await getAssetsByCreator(creatorAddress, marketplace, traitValue);
    }

    result.items.forEach((nfts) => {
      if (!nfts.burnt) {
        allHolders.push(nfts.ownership.owner);

        if (!marketplaceAddress.includes(nfts.ownership.owner)) {
          unlistedHolders.push(nfts.ownership.owner);
        }

        if (traitValue && nfts.content.metadata) {
          const traitMatch = nfts.content.metadata.attributes.some(
            (attribute) => attribute.value === traitValue
          );

          if (traitMatch) {
            traitMatchHolders.push(nfts.ownership.owner);
          }
        }
      }
    });

    if (result.items.length < 1000) {
      hasMoreResults = false;
    } else {
      page++;
    }
  }

  console.log("allHolders:", allHolders);
  console.log("unlistedHolders:", unlistedHolders);
  console.log("traitMatchHolders:", traitMatchHolders);

  if (marketplace && traitValue) {
    // Scenario 4: Full list where trait value matched excluding marketplaceAddresses
    return traitMatchHolders.filter(
      (holder) => !marketplaceAddress.includes(holder)
    );
  } else if (marketplace) {
    // Scenario 2: Full list excluding marketplaceAddresses
    return unlistedHolders;
  } else if (traitValue) {
    // Scenario 3: Full list where trait value matches
    return traitMatchHolders;
  } else {
    // Scenario 1: Full list of all wallet addresses
    return allHolders;
  }
};

// Existing imports and constants...

const getAssetsByCreator = async (creatorAddress, marketplace, traitValue) => {
  try {
    let page = 1;
    let hasMoreResults = true;
    let allHolders = [];
    let unlistedHolders = [];
    let traitMatchHolders = [];

    while (hasMoreResults) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "my-id",
          method: "getAssetsByCreator",
          params: {
            creatorAddress,
            page,
            limit: 1000,
          },
        }),
      });

      const { result } = await response.json();

      if (result.items.length === 0 && page === 1) {
        // If there are no results in the first page, exit the loop
        hasMoreResults = false;
      }

      result.items.forEach((nfts) => {
        if (!nfts.burnt) {
          allHolders.push(nfts.ownership.owner);

          if (
            marketplace &&
            !marketplaceAddress.includes(nfts.ownership.owner)
          ) {
            unlistedHolders.push(nfts.ownership.owner);
          }

          if (traitValue && nfts.content.metadata) {
            const traitMatch = nfts.content.metadata.attributes.some(
              (attribute) => attribute.value === traitValue
            );

            if (traitMatch) {
              traitMatchHolders.push(nfts.ownership.owner);
            }
          }
        }
      });

      if (result.items.length < 1000) {
        hasMoreResults = false;
      } else {
        page++;
      }
    }

    console.log("allHolders:", allHolders);
    console.log("unlistedHolders:", unlistedHolders);
    console.log("traitMatchHolders:", traitMatchHolders);

    if (marketplace && traitValue) {
      // Scenario 4: Full list where trait value matched excluding marketplaceAddresses
      return traitMatchHolders.filter(
        (holder) => !marketplaceAddress.includes(holder)
      );
    } else if (marketplace) {
      // Scenario 2: Full list excluding marketplaceAddresses
      return unlistedHolders;
    } else if (traitValue) {
      // Scenario 3: Full list where trait value matches
      return traitMatchHolders;
    } else {
      // Scenario 1: Full list of all wallet addresses
      return allHolders;
    }
  } catch (error) {
    console.error("Error in getAssetsByCreator:", error);
    throw error;
  }
};

// Export statement...

//   const { result } = await response.json();
//   return result.items.map((nfts) => nfts.ownership.owner);
// };

export { getAssetsByGroup, getAssetsByCreator };
