// api.js
"use client";

const url =
  "https://mainnet.helius-rpc.com/?api-key=45c66c7d-affb-4a5d-a5d6-3639fe81a4f1";
const marketplaceAddress = [
  "4zdNGgAtFsW1cQgHqkiWyRsxaAgxrSRRynnuunxzjxue",
  "1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix",
];

const getAssetsByGroup = async (
  creatorAddress,
  marketplace,
  traitValue,
  hashlistHolder
) => {
  try {
    let page = 1;
    let hasMoreResults = true;
    let allHolders = [];
    let unlistedHolders = [];
    let traitMatchHolders = [];
    let hashlist = [];

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
        return await getAssetsByCreator(
          creatorAddress,
          marketplace,
          traitValue,
          hashlistHolder
        );
      }

      result.items.forEach((nft) => {
        if (!nft.burnt) {
          allHolders.push(nft.ownership.owner);

          if (!marketplaceAddress.includes(nft.ownership.owner)) {
            unlistedHolders.push(nft.ownership.owner);
          }

          if (traitValue && nft.content.metadata) {
            const traitMatch = nft.content.metadata.attributes.some(
              (attribute) => attribute.value === traitValue
            );

            if (traitMatch) {
              traitMatchHolders.push(nft.ownership.owner);
            }
          }

          // Add to hashlist only when the checkbox is checked
          if (hashlistHolder) {
            // Perform the four scenarios and add nft.id to the hashlist array
            if (marketplace && traitValue) {
              // Scenario 4: Full list where trait value matched excluding marketplaceAddresses
              if (!marketplaceAddress.includes(nft.ownership.owner)) {
                const traitMatch = nft.content.metadata.attributes.some(
                  (attribute) => attribute.value === traitValue
                );
                if (traitMatch) {
                  hashlist.push(nft.id);
                }
              }
            } else if (marketplace) {
              // Scenario 2: Full list excluding marketplaceAddresses
              if (!marketplaceAddress.includes(nft.ownership.owner)) {
                hashlist.push(nft.id);
              }
            } else if (traitValue) {
              // Scenario 3: Full list where trait value matches
              const traitMatch = nft.content.metadata.attributes.some(
                (attribute) => attribute.value === traitValue
              );
              if (traitMatch) {
                hashlist.push(nft.id);
              }
            } else {
              // Scenario 1: Full list of all wallet addresses
              hashlist.push(nft.id);
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

    // Return hashlist when hashlistHolder is checked
    if (hashlistHolder) {
      return hashlist;
    }

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
    console.error("Error in getAssetsByGroup:", error);
    throw error;
  }
};

const getAssetsByCreator = async (
  creatorAddress,
  marketplace,
  traitValue,
  hashlistHolder
) => {
  try {
    let page = 1;
    let hasMoreResults = true;
    let allHolders = [];
    let unlistedHolders = [];
    let traitMatchHolders = [];
    let hashlist = [];

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

      result.items.forEach((nft) => {
        if (!nft.burnt) {
          allHolders.push(nft.ownership.owner);

          if (
            marketplace &&
            !marketplaceAddress.includes(nft.ownership.owner)
          ) {
            unlistedHolders.push(nft.ownership.owner);
          }

          if (traitValue && nft.content.metadata) {
            const traitMatch = nft.content.metadata.attributes.some(
              (attribute) => attribute.value === traitValue
            );

            if (traitMatch) {
              traitMatchHolders.push(nft.ownership.owner);
            }
          }

          // Add to hashlist only when the checkbox is checked
          if (hashlistHolder) {
            // Perform the four scenarios and add nft.id to the hashlist array
            if (marketplace && traitValue) {
              // Scenario 4: Full list where trait value matched excluding marketplaceAddresses
              if (!marketplaceAddress.includes(nft.ownership.owner)) {
                const traitMatch = nft.content.metadata.attributes.some(
                  (attribute) => attribute.value === traitValue
                );
                if (traitMatch) {
                  hashlist.push(nft.id);
                }
              }
            } else if (marketplace) {
              // Scenario 2: Full list excluding marketplaceAddresses
              if (!marketplaceAddress.includes(nft.ownership.owner)) {
                hashlist.push(nft.id);
              }
            } else if (traitValue) {
              // Scenario 3: Full list where trait value matches
              const traitMatch = nft.content.metadata.attributes.some(
                (attribute) => attribute.value === traitValue
              );
              if (traitMatch) {
                hashlist.push(nft.id);
              }
            } else {
              // Scenario 1: Full list of all wallet addresses
              hashlist.push(nft.id);
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

    // Return hashlist when hashlistHolder is checked
    if (hashlistHolder) {
      return hashlist;
    }

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

export { getAssetsByGroup, getAssetsByCreator };
