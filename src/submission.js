import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "firebase/firestore";

const submissionForm = document.getElementById("submission-form");
const submissionMessage = document.getElementById("submission-message");

submissionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const landlordName = document.getElementById("landlord-name").value.trim();
    const landlordPhone = document.getElementById("landlord-phone").value.trim();
    const landlordEmail = document.getElementById("landlord-email").value.trim();
    const propertyTitle = document.getElementById("property-title").value.trim();
    const location = document.getElementById("property-location").value.trim();
    const description = document.getElementById("property-description").value.trim();

    try {
        await addDoc(collection(db, "submissions"), {
            landlordName,
            landlordPhone,
            landlordEmail,
            propertyTitle,
            location,
            description,
            status: "pending",
            submittedAt: serverTimestamp()
        });

        submissionMessage.textContent =
            "Your property has been submitted for review.";

        submissionForm.reset();

    } catch (error) {
        console.error("Submission error:", error);

        submissionMessage.textContent =
            "Unable to submit your property. Please try again.";
    }
});