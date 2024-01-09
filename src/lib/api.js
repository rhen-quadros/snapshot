// api.js
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

export { getAssetsByGroup };
