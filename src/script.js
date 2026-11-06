import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";

console.log("Firebase connected!");
console.log("Firestore:", db);
console.log("Authentication:", auth);



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

let accommodations = [
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



async function loadAccommodations() {
    try {
        const accommodationsQuery = query(
            collection(db, "accommodations"),
            where("status", "==", "approved")
        );

        const querySnapshot = await getDocs(accommodationsQuery);

        accommodations = querySnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                location: data.location?.toLowerCase() || "",
                title: data.title || "Untitled Residence",
                price: data.monthlyPrice || 0,
                accommodationType: data.accommodationType || "Not specified",
                contact: data.contact || "Contact details not yet confirmed",
                description: data.description || "Description not yet available",
               facilities: data.facilities || [],
                image: data.image || "",
                rooms: data.rooms || [],
                availability: data.availability || "To be confirmed",

                electricityIncluded: data.electricityIncluded,
                wifiOption: data.wifiOption,
                wifiMonthlyPrice: data.wifiMonthlyPrice
                            };
        });

        console.log("Accommodations loaded:", accommodations);

    } catch (error) {
        console.error("Error loading accommodations:", error);
        searchMessage.textContent = "Unable to load accommodation listings. Please try again later.";
    }
}


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

        const availability = accommodation.availability || "To be confirmed";

        const availabilityClass =
         availability === "Available"
           ? "available"
            : availability === "Fully booked"
            ? "fully-booked"
            : "to-be-confirmed";



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
                   ${accommodation.image
                        ? `<img
                            src="${accommodation.image}"
                            alt="Photo of ${accommodation.title}"
                            class="residence-image"
                        >`
                        : `<p class="image-placeholder">Photo not yet available.</p>`
                    }

                    <h3>${accommodation.title}</h3>

                    <p>
                        Location: ${accommodation.location}
                    </p>

                    <p class="accommodation-price">
                        From R${lowestRoomPrice.toLocaleString()}
                        <span>/ month</span>
                    </p>

                    <p class="room-availability ${availabilityClass}">
                     ${availability}
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

             const availability = accommodation.availability || "To be confirmed";

                const availabilityClass =
                 availability === "Available"
               ? "available"
                : availability === "Fully booked"
            ? "fully-booked"
            : "to-be-confirmed";

                    
const roomsList = accommodation.rooms?.length
    ? `
        <div class="room-list">
            ${accommodation.rooms.map(room => `
                <div class="room-item">
                    <h4>${room.name}</h4>
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


    const electricityDetails =
        accommodation.electricityIncluded === true
            ? "Included in rent (Free)"
            : accommodation.electricityIncluded === false
            ? "Paid separately"
            : "Not yet confirmed";

    const wifiDetails =
        accommodation.wifiOption === "included"
            ? "Included in rent (Free)"
            : accommodation.wifiOption === "paid"
            ? `Optional — R${Number(accommodation.wifiMonthlyPrice || 0).toLocaleString()} per student/month`
            : accommodation.wifiOption === "unavailable"
            ? "Not available"
            : "Not yet confirmed";


                    const facilitiesList = accommodation.facilities?.length
                        ? accommodation.facilities
                            .map(facility => `<li>${facility}</li>`)
                            .join("")
                        : "<li>Facilities not yet confirmed.</li>";

                    detailsContent.innerHTML = `
                        <article class="accommodation-card">
                           ${accommodation.image
                                ? `<img
                                    src="${accommodation.image}"
                                    alt="Photo of ${accommodation.title}"
                                    class="residence-image"
                                >`
                                : `<p class="image-placeholder">Photo not yet available.</p>`
                            }

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



                            <h3>Utilities & Additional Costs</h3>

                            <div class="utilities-details">
                                <p>
                                    <strong>Electricity:</strong>
                                    ${electricityDetails}
                                </p>

                                <p>
                                    <strong>Wi-Fi:</strong>
                                    ${wifiDetails}
                                </p>
                            </div>

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
                            <div class="contact-buttons">
                                <a
                                    href="tel:${accommodation.contact}"
                                    class="call-button"
                                    aria-label="Call residence"
                                    title="Call residence"
                                >
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2
                                    19.79 19.79 0 0 1-8.63-3.07
                                    19.5 19.5 0 0 1-6-6
                                    19.79 19.79 0 0 1-3.07-8.67
                                    A2 2 0 0 1 4.11 2h3
                                    a2 2 0 0 1 2 1.72
                                    c.12.96.36 1.9.72 2.8
                                    a2 2 0 0 1-.45 2.11L8.11 9.89
                                    a16 16 0 0 0 6 6l1.27-1.27
                                    a2 2 0 0 1 2.11-.45
                                    c.9.36 1.84.6 2.8.72
                                    A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                </a>

                                <a
                                    href="https://wa.me/${accommodation.contact.replace(/\D/g, "").replace(/^0/, "27")}"
                                    class="whatsapp-button"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="WhatsApp residence"
                                    title="WhatsApp residence"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M12.04 2a9.93 9.93 0 0 0-8.51 15.06L2 22l5.11-1.48A9.93 9.93 0 1 0 12.04 2zm0 18.1a8.16 8.16 0 0 1-4.16-1.14l-.3-.18-3.03.88.9-2.95-.2-.3A8.17 8.17 0 1 1 12.04 20.1zm4.49-6.12c-.25-.12-1.48-.73-1.71-.81-.23-.08-.4-.12-.57.12-.17.25-.65.81-.8.98-.15.17-.3.19-.56.06-.25-.12-1.07-.39-2.04-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.3.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.57-1.37-.78-1.88-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.12.17 1.77 2.7 4.29 3.79.6.26 1.07.42 1.44.54.61.19 1.17.16 1.61.1.49-.07 1.48-.61 1.69-1.2.21-.59.21-1.1.15-1.2-.06-.1-.23-.17-.48-.29z"/>
                                    </svg>
                                </a>
                            </div>

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
const menuClose = document.getElementById("menu-close");
const navOverlay = document.getElementById("nav-overlay");

function openMenu() {
    mainNav.classList.add("is-open");
    navOverlay.classList.add("is-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");

    document.body.style.overflow = "hidden";
}

function closeMenu() {
    mainNav.classList.remove("is-open");
    navOverlay.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    document.body.style.overflow = "";
}

menuToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.contains("is-open");

    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});

menuClose.addEventListener("click", closeMenu);

navOverlay.addEventListener("click", closeMenu);

// Close menu when a navigation link is selected.
mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
});

// Close menu when Escape is pressed.
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeMenu();
    }
});


loadAccommodations();