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

function createNFTCard(item, thumbnailPath) {
    const nftCard = document.createElement('div');
    nftCard.className = 'nft-card';
    // Use percentages or viewport units for responsive design
    nftCard.style.width = 'calc(100% - 10px)'; // Adjust width to be responsive, subtracting padding
    // nftCard.style.maxWidth = '210px'; // Set a max-width to ensure cards don't grow too large
    nftCard.style.height = 'auto'; // Height adjusts based on content
    nftCard.style.flex = '1 0 auto'; // Allow card to grow within flex container
    nftCard.style.display = 'flex';
    nftCard.style.flexDirection = 'column';
    nftCard.style.alignItems = 'flex-start';
    nftCard.style.padding = '5px';
    nftCard.style.gap = '10px';
    nftCard.style.background = '#FE1203';
    nftCard.style.borderRadius = '7px';
    nftCard.style.boxSizing = 'border-box';

    const imageContainer = document.createElement('div');
    imageContainer.style.display = 'flex';
    imageContainer.style.alignItems = 'center';
    imageContainer.style.justifyContent = 'center';
    imageContainer.style.width = '100%'; // Make the image container responsive
    imageContainer.style.paddingTop = '150px'; // Use padding-top for aspect ratio
    imageContainer.style.position = 'relative'; // Needed for absolute positioning of img
    imageContainer.style.background = '#192C27';
    // imageContainer.style.border = '1px solid #696969';
    imageContainer.style.borderRadius = '7px';

    const img = document.createElement('img');
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    // img.style.width = '100%'; // Image fills the container width
    // img.style.maxWidth = '150px'; // Limit image size
    img.style.height = '150px'; // Adjust height automatically
    img.style.borderRadius = '7px 7px 0px 0px';
    img.src = thumbnailPath;
    img.alt = item.name;

    const content = document.createElement('div');
    content.style.maxWidth = '110px;'; // Content fills the card
    content.className = 'content';
    content.style.width = '120px;'; // Content fills the card
    content.style.flexGrow = '1'; // Allow content to fill available space
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.justifyContent = 'center';
    content.style.alignItems = 'flex-start';
    // content.style.padding = '10px 20px';
    // content.style.gap = '10px';
    content.style.background = '#FE1203';
    content.style.color = '#000000';

    // Example content: title and rarity
    const title = document.createElement('div');
    title.textContent = item.name;
    title.style.fontFamily = 'Spline Sans, sans-serif';
    title.style.fontSize = '12px';
    title.style.lineHeight = '143%';
    title.style.textTransform = 'uppercase';
    title.style.color = '#000000';

    const rarity = document.createElement('div');
    rarity.textContent = `Rarity: ${item.Rarity || 'N/A'}`;
    rarity.style.fontFamily = 'Spline Sans, sans-serif';
    rarity.style.fontSize = '17px';
    rarity.style.lineHeight = '143%';
    rarity.style.textTransform = 'uppercase';
    rarity.style.color = '#000000';

    // Assemble the card
    imageContainer.appendChild(img);
    nftCard.appendChild(imageContainer);
    content.appendChild(title);
    content.appendChild(rarity);
    nftCard.appendChild(content);

    // Set initial opacity to 40%
    gsap.set(nftCard, { opacity: 0.4 });

    // Mouseover event to fade to 100% opacity
    nftCard.addEventListener('mouseover', function() {
        gsap.to(nftCard, { opacity: 1, duration: 0.3 });
    });

    // Mouseout event to fade back to 40% opacity
    nftCard.addEventListener('mouseout', function() {
        gsap.to(nftCard, { opacity: 0.4, duration: 0.3 });
    });

    return nftCard;
}


function lazyLoadImages() {
    // Lazy loading logic remains unchanged
}

console.log(gsap);
gsap.registerPlugin(Flip); // Ensure GSAP plugins are registered if used

// The 'sortCollectionByRarity' and 'searchAndDisplayFirst' functions remain unchanged
// No need to repeat them here if they are unchanged from your original code

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
