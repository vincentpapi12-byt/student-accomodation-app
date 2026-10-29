// ========================================
// 1. GET HTML ELEMENTS
// ========================================

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


// ========================================
// 2. VALID LOCATIONS
// ========================================

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


// ========================================
// 3. ACCOMMODATION DATA
// ========================================

const accommodations = [
    {
        location: "gate 2",
        title: "Example Student Residence",
        price: 2500,
        accommodationType: "Student Residence",
        contact: "Contact details coming soon",
        description: "Description coming soon",
        facilities: ["Wi-Fi", "Laundry", "Study area"],
        image: "/student-accomodation-app/images/residence-example.jpg",
        rooms: [
    {
        type: "Single room",
        price: 2500,
        available: true
    },
    {
        type: "Shared room",
        price: 1800,
        available: true
    }
],
        availability: "To be confirmed"
    },

    
{
    location: "unit a",
    title: "Campus Corner Residence",
    price: 3200,
    accommodationType: "Student Residence",
    contact: "Contact details coming soon",
    description: "Student accommodation close to campus.",
    facilities: ["Wi-Fi", "Study area", "Security", "Laundry"],
    image: "/student-accomodation-app/images/residence-example.jpg",
   rooms: [
    {
        type: "Single room",
        price: 3200,
        available: true
    },
    {
        type: "Shared room",
        price: 2400,
        available: true
    }
],
    availability: "Available"
},
{
    location: "gate 1",
    title: "Green View Student Rooms",
    price: 2200,
    accommodationType: "Shared Accommodation",
    contact: "Contact details coming soon",
    description: "Shared student rooms with essential facilities.",
    facilities: ["Water", "Electricity", "Communal kitchen"],
    image: "/student-accomodation-app/images/residence-example.jpg",
    rooms: [
    {
        type: "Shared room",
        price: 2200,
        available: false
    }
],
    availability: "Fully booked"
}

];


// ========================================
// 4. SEARCH AND FILTER
// ========================================

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const location = locationInput.value.trim().toLowerCase();
    const maxBudget = Number(budgetFilter.value);

    searchMessage.textContent = "";
    accommodationList.innerHTML = "";

    listingsSection.hidden = true;
    residenceDetails.hidden = true;

    if (location === "") {
        searchMessage.textContent = "Please enter a location.";
        return;
    }

    if (!locations.includes(location)) {
        searchMessage.textContent =
            "Location not found. Try Unit A or Gate 2.";
        return;
    }

    // Find matching residences.
   
const matchingAccommodations = accommodations.filter(
    accommodation => {
        const matchesLocation =
            accommodation.location.toLowerCase() === location;

        const matchesBudget =
            !maxBudget ||
            accommodation.price <= maxBudget ||
            accommodation.rooms?.some(room => room.price <= maxBudget);

        return matchesLocation && matchesBudget;
    }
);


    // Sort residences by price.
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

    // ========================================
    // 5. DISPLAY RESIDENCE CARDS
    // ========================================

    if (matchingAccommodations.length > 0) {
        searchMessage.textContent =
            `Showing residences in ${location}`;

        matchingAccommodations.forEach(accommodation => {
            
            const lowestRoomPrice = accommodation.rooms?.length
            ? Math.min(
                ...accommodation.rooms.map(room => room.price)
            )
            : accommodation.price;

           const hasAvailableRooms = accommodation.rooms?.some(
                room => room.available
            ) ?? false;

            const displayAvailability = hasAvailableRooms
                ? "Available"
                : "Fully booked";

            const facilitiesPreview = accommodation.facilities?.length
                ? `
                    <div class="facilities-preview">
                        <strong>Facilities</strong>

                        <div class="facility-tags">
                            ${accommodation.facilities
                                .slice(0, 3)
                                .map(facility =>
                                    `<span class="facility-tag">${facility}</span>`
                                )
                                .join("")}
                        </div>
                    </div>
                `
                : `
                    <p class="facilities-preview">
                        Facilities not yet confirmed.
                    </p>
                `;

            accommodationList.innerHTML += `
                <article class="accommodation-card">
                    <img
                        src="${accommodation.image}"
                        alt="Photo of ${accommodation.title}"
                        class="residence-image"
                    >

                    <h3>${accommodation.title}</h3>

                    <p>
                        Location: ${accommodation.location}
                    </p>

                    <p class="accommodation-price">
                        From R${lowestRoomPrice.toLocaleString()}
                        <span>/ month</span>
                    </p>

                    <p class="room-availability ${hasAvailableRooms ? "available" : "fully-booked"}">
                        ${hasAvailableRooms ? "Rooms available" : "Fully booked"}
                    </p>

                    <p>
                        Type: ${accommodation.accommodationType}
                    </p>

                    ${facilitiesPreview}

                    <button
                        class="details-button"
                        type="button"
                    >
                        View Details
                    </button>
                </article>
            `;
        });

        // ========================================
        // 6. VIEW FULL RESIDENCE DETAILS
        // ========================================

        accommodationList
            .querySelectorAll(".details-button")
            .forEach((button, index) => {
                button.addEventListener("click", function () {
                    const accommodation =
                        matchingAccommodations[index];

               const hasAvailableRooms = accommodation.rooms?.some(
                    room => room.available
                ) ?? false;

                const availability = hasAvailableRooms
                    ? "Available"
                    : "Fully booked";

                const availabilityClass = hasAvailableRooms
                    ? "available"
                    : "fully-booked";

                    
const roomsList = accommodation.rooms?.length
    ? `
        <div class="room-list">
            ${accommodation.rooms.map(room => `
                <div class="room-item">
                    <h4>${room.type}</h4>
                    <p>R${room.price.toLocaleString()} per month</p>
                    <p class="room-status ${room.available ? "available" : "not-available"}">
                        ${room.available ? "Available" : "Not available"}
                    </p>
                </div>
            `).join("")}
        </div>
    `
    : `
        <p>Room details not yet confirmed.</p>
    `;


                    const facilitiesList = accommodation.facilities?.length
                        ? accommodation.facilities
                            .map(facility => `<li>${facility}</li>`)
                            .join("")
                        : "<li>Facilities not yet confirmed.</li>";

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
                                <strong>Starting price:</strong>
                                R${(accommodation.rooms?.length
                                    ? Math.min(...accommodation.rooms.map(room => room.price))
                                    : accommodation.price
                                ).toLocaleString()}
                                per month
                            </p>

                            <p>
                                <strong>Type:</strong>
                                ${accommodation.accommodationType}
                            </p>

                            <h3>Room options</h3>
                            ${roomsList}

                            <p>
                                <strong>Availability:</strong>
                                <span class="availability-status ${availabilityClass}">
                                    ${availability}
                                </span>
                            </p>

                            <p>
                                <strong>Contact:</strong>
                                ${accommodation.contact}
                            </p>

                            <h3>Facilities</h3>

                            <ul>
                                ${facilitiesList}
                            </ul>
                        </article>
                    `;

                    listingsSection.hidden = true;
                    residenceDetails.hidden = false;

                    // Move the user to the details section.
                    residenceDetails.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                });
            });

    } else {
        searchMessage.textContent =
            `No residences found for ${location}. Try another location or increase your budget.`;
    }
});


// ========================================
// 7. BACK TO LISTINGS
// ========================================

backButton.addEventListener("click", function () {
    residenceDetails.hidden = true;
    listingsSection.hidden = false;

    listingsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


// ========================================
// 8. MOBILE NAVIGATION
// ========================================

const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

menuToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

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