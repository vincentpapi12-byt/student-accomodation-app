
const searchForm = document.querySelector(".search-form");
const locationInput = document.querySelector('[type="search"]');
const searchMessage = document.querySelector(".search-message");
const budgetFilter = document.getElementById("budget-filter");
const sortFilter = document.getElementById("sort-filter");


const accommodationList = document.getElementById("accommodation-list");
const listingsSection = document.getElementById("listings");

const residenceDetails = document.getElementById("residence-details");
const detailsContent = document.getElementById("details-content");
const backButton = document.getElementById("back-to-listings");


const locations = [
    "unit a",
    "unit b",
    "unit c",
    "unit d",
    "unit e",
    "unit f",
    "gate 1",
    "gate 2",
    "gate 3"
];

const accommodations = [
    {
        location: "gate 2",
        title: "Example Student Residence",
        price: 2500,
        accommodationType: "Student Residence",
        contact: "Contact details coming soon",
        description: "Description coming soon",
        facilities: ["Wi-Fi", "Laundry", "Study area"],
        image: "public/images/residence-example.jpg",
        roomTypes: ["Single room", "Shared room"],
        availability: "To be confirmed",
    }
];



searchForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const location = locationInput.value.trim();
    const searchLocation = location.toLowerCase();
    const maxBudget = Number(budgetFilter.value);

    searchMessage.textContent = "";
    accommodationList.innerHTML = "";
    listingsSection.hidden = true;

    if (location === "") {
        searchMessage.textContent = "Please enter a location.";
        return;
    }

    if (!locations.includes(searchLocation)) {
        searchMessage.textContent =
            "Location not found. Try Unit A or Gate 2.";
        return;
    }

    //Choose Budget 

   const matchingAccommodations = accommodations.filter(
    accommodation =>
        accommodation.location === searchLocation &&
        (!maxBudget || accommodation.price <= maxBudget)
);

//Default price Order

const sortOrder = sortFilter.value;

if (sortOrder === "price-low") {
    matchingAccommodations.sort(
        (a, b) => a.price - b.price
    );
} else if (sortOrder === "price-high") {
    matchingAccommodations.sort(
        (a, b) => b.price - a.price
    );
}


    listingsSection.hidden = false;

    if (matchingAccommodations.length > 0) {
        searchMessage.textContent =
            `Showing residences in ${location}`;

        matchingAccommodations.forEach(accommodation => {
            accommodationList.innerHTML += `
                <article class="accommodation-card">
                    <img
                        src="${accommodation.image}"
                        alt="Photo of ${accommodation.title}"
                       class="residence-image"
                    >
                    <h3>${accommodation.title}</h3>
                    <p>Location: ${accommodation.location}</p>
                        <p class="accommodation-price">
                        R${accommodation.price.toLocaleString()}
                        <span>/ month</span>
                    </p>
                    <p>Type: ${accommodation.accommodationType}</p>

                  ${accommodation.facilities?.length
                        ? `<div class="facilities-preview">
                            <strong>Facilities</strong>
                            <div class="facility-tags">
                                ${accommodation.facilities.map(facility =>
                                    `<span class="facility-tag">${facility}</span>`
                                ).join("")}
                            </div>
                        </div>`
                        : `<p class="facilities-preview">Facilities not yet confirmed.</p>`
                    }
                    <button class="details-button" type="button">View Details</button>
                </article>
            `;
        });

  
accommodationList.querySelectorAll(".details-button").forEach(
    (button, index) => {
        button.addEventListener("click", function() {
            const accommodation = matchingAccommodations[index];

           
detailsContent.innerHTML = `
    <article class="accommodation-card">
        <img
            src="${accommodation.image}"
            alt="Photo of ${accommodation.title}"
            class="residence-image"
        >

        <h2>${accommodation.title}</h2>

        <p>${accommodation.description}</p>

        <p>
            <strong>Location:</strong>
            ${accommodation.location}
        </p>

        <p>
            <strong>Price:</strong>
            R${accommodation.price.toLocaleString()} per month
        </p>

        <p>
            <strong>Type:</strong>
            ${accommodation.accommodationType}
        </p>

        <p>
            <strong>Room types:</strong>
            ${accommodation.roomTypes?.length
                ? accommodation.roomTypes.join(", ")
                : "Not yet confirmed"}
        </p>

        <p>
            <strong>Availability:</strong>
            <span class="availability-status ${(accommodation.availability || "To be confirmed")
            .toLowerCase()
            .replaceAll(" ", "-") === "available"
                ? "available"
        : (accommodation.availability || "To be confirmed")
            .toLowerCase()
            .replaceAll(" ", "-") === "fully-booked"
                ? "fully-booked"
                : "to-be-confirmed"}">
                ${accommodation.availability || "To be confirmed"}
            </span>
        </p>

        <p>
            <strong>Contact:</strong>
            ${accommodation.contact}
        </p>

        <h3>Facilities</h3>

        <ul>
            ${accommodation.facilities
                .map(facility => `<li>${facility}</li>`)
                .join("")}
        </ul>
    </article>
`;


            listingsSection.hidden = true;
            residenceDetails.hidden = false;
        });
    }
);

    } else {
       searchMessage.textContent =
    `No residences found for ${location}. Try another location or increase your budget.`;
    }
});


backButton.addEventListener("click", function() {
    residenceDetails.hidden = true;
    listingsSection.hidden = false;
});


const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

menuToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
});

mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
    });
});
