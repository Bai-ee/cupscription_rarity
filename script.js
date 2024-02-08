document.addEventListener("DOMContentLoaded", async function() {
    await loadCollection(); // Ensuring the collection is loaded
    console.log("Collection Loaded");

    // Initially hide the grid and then animate it into view
    gsap.set(".nft-grid", { display: "none" });
    animateGrid();

    // Initialize lazy loading after the collection is loaded
    lazyLoadImages();
});

async function loadCollection() {
    const response = await fetch('./cupscriptions-collection.json');
    const collection = await response.json();
    displayCollectionInfo(collection);

    // Sort the collection items by numerical order extracted from their names
    const sortedItemsByName = collection.collection_items.sort((a, b) => {
        const numA = parseInt(a.name.replace(/^\D+/g, ''));
        const numB = parseInt(b.name.replace(/^\D+/g, ''));
        return numA - numB;
    });

    await displayCollectionItems(sortedItemsByName);
}

function animateGrid() {
    console.log(gsap);
    // Uncomment the GSAP animation block if needed
    // if (document.querySelector(".nft-grid")) {
    //     gsap.to(".nft-grid", {
    //         duration: 1.5,
    //         display: "block",
    //         y: -100,
    //         opacity: 1,
    //         ease: "power3.out"
    //     });
    // } else {
    //     console.warn("GSAP animation target .nft-grid not found.");
    // }
}

function displayCollectionInfo(collection) {
    // Display collection information like name, description, etc.
}

function displayCollectionItems(items) {
    const nftGrid = document.getElementById('nft-grid');
    items.forEach(item => {
        const imagePath = `images/Cupscription_${parseInt(item.name.replace(/^\D+/g, ''))}.jpg`;
        const nftCard = createNFTCard(item, imagePath);
        nftGrid.appendChild(nftCard);
    });
}

function createNFTCard(item, imagePath) {
    const nftCard = document.createElement('div');
    nftCard.className = 'nft-card';
    nftCard.setAttribute('data-name', item.name); // Set the name attribute for searching

    // Set data attributes for sorting
    if(item.Rarity) {
        nftCard.setAttribute('data-rarity', item.Rarity); // Assuming 'item' has a 'Rarity' property
    }

    // Create a div that will contain the loader and the image
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    imageContainer.style.position = 'relative';
    imageContainer.style.width = '100%';
    imageContainer.style.height = '100%';

    // Add the loader
    const loader = document.createElement('div');
    loader.className = 'loader';
    imageContainer.appendChild(loader);

    const img = document.createElement('img');
    img.style.display = 'none'; // Initially hide the image
    img.src = imagePath; // Set the image source directly for loading
    img.alt = item.name;
    img.onload = function() {
        loader.remove(); // Remove the loader once the image is loaded
        img.style.display = ''; // Show the image
    };
    img.onerror = function() {
        nftCard.remove(); // Remove the NFT card if the image fails to load
    };
    imageContainer.appendChild(img);

    nftCard.appendChild(imageContainer);

    // Create and append content div for title, description, and attributes
    const content = document.createElement('div');
    content.className = 'content';
    content.innerHTML = `
        <div class="title">${item.name}</div>
        <div class="description">${item.description}</div>
    `;
    // Dynamically add attributes and rarity if available
    if (item.item_attributes) {
        item.item_attributes.forEach(attr => {
            const attributeElement = document.createElement('div');
            attributeElement.className = 'attribute';
            attributeElement.textContent = `${attr.trait_type}: ${attr.value}`;
            content.appendChild(attributeElement);
        });
    }

    if (item.Rarity) {
        const rarityElement = document.createElement('div');
        rarityElement.className = 'rarity-score';
        rarityElement.textContent = `Rarity: ${item.Rarity}`;
        content.appendChild(rarityElement);
    }

    nftCard.appendChild(content);

    return nftCard;
}

function lazyLoadImages() {
    // Lazy loading logic remains unchanged
}

console.log(gsap);
gsap.registerPlugin(Flip); // Ensure GSAP plugins are registered if used

// The 'sortCollectionByRarity' and 'searchAndDisplayFirst' functions remain unchanged
// No need to repeat them here if they are unchanged from your original code

// console.log(Flip)

function sortCollectionByRarity() {
    const nftGrid = document.getElementById('nft-grid');
    const nfts = Array.from(nftGrid.children);

    // Capture the state before sorting for the FLIP animation
    const state = Flip.getState(nfts);

    // Sort the NFTs based on the rarity percentage, assuming data-rarity holds a numerical value
    const sortedNfts = nfts.sort((a, b) => {
        const aValue = parseFloat(a.getAttribute('data-rarity')) || 0; // Default to 0 if not set
        const bValue = parseFloat(b.getAttribute('data-rarity')) || 0; // Default to 0 if not set
        return bValue - aValue; // Sort in descending order
    });

    // Re-append sorted NFTs back to the grid
    sortedNfts.forEach(nft => nftGrid.appendChild(nft));

    // Animate the reordering using FLIP
    Flip.from(state, {
        duration: 0.7,
        ease: "power1.inOut",
        absolute: true, // Use absolute positioning for FLIP calculations
        scale: true, // Animate scaling if elements change size
        simple: true // Simplifies the animation to avoid perspective warping
    });
}

function searchAndDisplayFirst() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const nftGrid = document.getElementById('nft-grid');
    const nfts = Array.from(nftGrid.children);

    // Find the index of the NFT that matches the search query by name
    const foundIndex = nfts.findIndex(nft => {
        const nameValue = nft.getAttribute('data-name') || ""; // Use the 'data-name' attribute
        return nameValue.toLowerCase().includes(searchValue);
    });

    if (foundIndex > -1) {
        const foundNft = nfts.splice(foundIndex, 1)[0];
        nftGrid.prepend(foundNft);

        // Optionally, use GSAP's FLIP plugin for a smooth transition
        const state = Flip.getState(nfts);
        nfts.unshift(foundNft); // Add the found NFT back to the start of the array
        nfts.forEach(nft => nftGrid.appendChild(nft)); // Re-append all NFTs to reorder them in the grid
        Flip.from(state, {
            duration: 0.7,
            ease: "power1.inOut",
            absolute: true,
            scale: true,
            simple: true
        });
    } else {
        alert("No matching name found.");
    }
}

// Attach a click event listener to the sort button
const sortButton = document.getElementById('sort-button');
sortButton.addEventListener('click', sortCollectionByName);

// Sorting function to sort items by name (A-Z)
function sortCollectionByName() {
    const nftGrid = document.getElementById('nft-grid');
    const nfts = Array.from(nftGrid.children);

    // Capture the state before sorting for the FLIP animation
    const state = Flip.getState(nfts);

    // Sort the NFTs based on their names (A-Z)
    const sortedNfts = nfts.sort((a, b) => {
        const nameA = (a.getAttribute('data-name') || '').toLowerCase();
        const nameB = (b.getAttribute('data-name') || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });

    // Re-append sorted NFTs back to the grid
    sortedNfts.forEach(nft => nftGrid.appendChild(nft));

    // Animate the reordering using FLIP
    Flip.from(state, {
        duration: 0.7,
        ease: "power1.inOut",
        absolute: true,
        scale: true,
        simple: true
    });
}



