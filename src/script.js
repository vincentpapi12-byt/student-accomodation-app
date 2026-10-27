
const searchForm = document.querySelector(".search-form");
const locationInput = document.querySelector('[type="search"]');
const searchMessage = document.querySelector(".search-message");
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
       image: "public/images/residence-example.jpg"
    }
];



searchForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const location = locationInput.value.trim();
    const searchLocation = location.toLowerCase();

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

    const matchingAccommodations = accommodations.filter(
        accommodation => accommodation.location === searchLocation
    );

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
                    <p>Price: R${accommodation.price.toLocaleString()} per month</p>
                    <p>Type: ${accommodation.accommodationType}</p>
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
            `No residences currently listed for ${location}.`;
    }
});


backButton.addEventListener("click", function() {
    residenceDetails.hidden = true;
    listingsSection.hidden = false;
});
