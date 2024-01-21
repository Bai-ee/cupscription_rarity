document.addEventListener("DOMContentLoaded", async function() {
    await loadCollection(); // Ensuring the collection is loaded
    console.log("Collection Loaded");

    // Initially hide the grid and then animate it into view
    gsap.set(".nft-grid", { display: "none" });
    animateGrid();
});

async function loadCollection() {
    const response = await fetch('./cupscriptions-collection.json');
    const collection = await response.json();
    displayCollectionInfo(collection);
    await displayCollectionItems(collection.collection_items); // Make sure items are loaded
}

function animateGrid() {

    console.log(gsap);
    // if (document.querySelector(".nft-grid")) {
    //     // GSAP Tween - Animate the grid into view
    //     gsap.to(".nft-grid", {
    //         duration: 1.5,
    //         display: "block",
    //         y: -100, // Start 100px above the final position
    //         opacity: 1,
    //         ease: "power3.out"
    //     });
    // } else {
    //     console.warn("GSAP animation target .nft-grid not found.");
    // }
}


function displayCollectionInfo(collection) {
    // Optional: Display collection information like name, description, etc.
    // This can be done by manipulating the DOM to show these details.
}

function displayCollectionItems(items) {
    const nftGrid = document.getElementById('nft-grid');
    items.forEach(item => {
        const imagePath = `images/Cupscription_${item.item_index + 1}.jpg`;
        const nftCard = createNFTCard(item, imagePath);
        nftGrid.appendChild(nftCard);
    });
}

function createNFTCard(item, imagePath) {
    const attributesHTML = item.item_attributes.map(attr => `<div class="attribute">${attr.trait_type}: ${attr.value}</div>`).join('');
    const rarityHTML = item.Rarity ? `<div class="rarity-score">Rarity: ${item.Rarity}</div>` : '';
    
    const nftCard = document.createElement('div');
    nftCard.className = 'nft-card';
    nftCard.innerHTML = `
        <img src="${imagePath}" alt="${item.name}">
        <div class="content">
            <div class="title">${item.name}</div>
            <div class="description">${item.description}</div>
            ${attributesHTML}
            ${rarityHTML}  <!-- Display Rarity here -->
        </div>
    `;
    return nftCard;
}

