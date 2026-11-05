import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    updateDoc,
    addDoc,
    writeBatch,
    serverTimestamp
} from "firebase/firestore";

// ========================================
// 1. GET HTML ELEMENTS
// ========================================

const loginForm = document.getElementById("admin-login-form");
const loginMessage = document.getElementById("login-message");

const adminDashboard = document.getElementById("admin-dashboard");
const logoutButton = document.getElementById("logout-button");

const roomOptionsContainer = document.getElementById("room-options-container");
const addRoomButton = document.getElementById("add-room-button");

const adminMessage = document.getElementById("admin-message");




function addRoomOption() {
    const roomDiv = document.createElement("div");
    roomDiv.className = "room-option";

    const roomNameLabel = document.createElement("label");
    roomNameLabel.textContent = "Room Type";

    const roomNameInput = document.createElement("input");
    roomNameInput.type = "text";
    roomNameInput.className = "room-name";
    roomNameInput.placeholder = "e.g. Single room";
    roomNameInput.required = true;

    const roomPriceLabel = document.createElement("label");
    roomPriceLabel.textContent = "Monthly Price (R)";

    const roomPriceInput = document.createElement("input");
    roomPriceInput.type = "number";
    roomPriceInput.className = "room-price";
    roomPriceInput.min = "1";
    roomPriceInput.required = true;

    const removeRoomButton = document.createElement("button");
          removeRoomButton.type = "button";
          removeRoomButton.textContent = "Remove Room";

    removeRoomButton.addEventListener("click", () => {
    roomDiv.remove();
        });

    roomDiv.append(
        roomNameLabel,
        roomNameInput,
        roomPriceLabel,
        removeRoomButton,
        roomPriceInput
    );

    roomOptionsContainer.appendChild(roomDiv);
}

addRoomButton.addEventListener("click", addRoomOption);

// ========================================
// 2. ADMIN LOGIN
// ========================================

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value;

    try {
        loginMessage.textContent = "Signing in...";

        await signInWithEmailAndPassword(auth, email, password);

    } catch (error) {
        console.error("Login error:", error);

        loginMessage.textContent = "Invalid email or password.";
    }
});


// ========================================
// 3. VERIFY ADMIN ACCESS
// ========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        adminDashboard.hidden = true;
        loginForm.hidden = false;
        return;
    }

    try {
        const adminRef = doc(db, "admins", user.uid);
        const adminSnapshot = await getDoc(adminRef);

        if (adminSnapshot.exists() &&
            adminSnapshot.data().role === "admin") {

            loginForm.hidden = true;
            adminDashboard.hidden = false;

            loginMessage.textContent = "";

            console.log("Admin verified!");
            await loadPendingSubmissions();

        } else {
            await signOut(auth);

            loginMessage.textContent =
                "You do not have administrator access.";
        }

    } catch (error) {
        console.error("Admin verification error:", error);

        await signOut(auth);

        loginMessage.textContent =
            "Unable to verify administrator access.";
    }
});


// ========================================
// 4. ADMIN LOGOUT
// ========================================

logoutButton.addEventListener("click", async () => {

    try {
        await signOut(auth);

        console.log("Admin signed out!");

    } catch (error) {
        console.error("Logout error:", error);
    }
});

// ========================================
// 5. LOAD PENDING SUBMISSIONS
// ========================================

const pendingSubmissions = document.getElementById("pending-submissions");

const approvalFormSection = document.getElementById("approval-form-section");
const cancelApproval = document.getElementById("cancel-approval");
const approvalForm = document.getElementById("approval-form");

let selectedSubmissionId = null;

async function loadPendingSubmissions() {

    try {
        const submissionsQuery = query(
            collection(db, "submissions"),
            where("status", "==", "pending")
        );

        const querySnapshot = await getDocs(submissionsQuery);

        pendingSubmissions.innerHTML = "";

        if (querySnapshot.empty) {
            pendingSubmissions.textContent = "No pending submissions.";
            return;
        }

       querySnapshot.forEach((submissionDoc) => {

           const submission = submissionDoc.data();

            const card = document.createElement("div");
            const title = document.createElement("h3");
            const landlord = document.createElement("p");
            const phone = document.createElement("p");
            const location = document.createElement("p");
            const description = document.createElement("p");

            const rejectButton = document.createElement("button");

            rejectButton.textContent = "Reject";

            rejectButton.addEventListener("click", () => {
                rejectSubmission(submissionDoc.id);
            });

            const approveButton = document.createElement("button");
            approveButton.textContent = "Approve";


            approveButton.addEventListener("click", () => {
                selectedSubmissionId = submissionDoc.id;
                approvalFormSection.hidden = false;
            });

            card.className = "submission-card";

            title.textContent = submission.propertyTitle;
            landlord.textContent = `Landlord: ${submission.landlordName}`;
            phone.textContent = `Contact: ${submission.landlordPhone}`;
            location.textContent = `Location: ${submission.location}`;
            description.textContent = `Description: ${submission.description}`;

            card.append(
                title,
                landlord,
                phone,
                location,
                description,
                approveButton,
                rejectButton
            );

            pendingSubmissions.appendChild(card);
            
        });

    } catch (error) {
        console.error("Error loading submissions:", error);

        pendingSubmissions.textContent =
            "Unable to load submissions.";
    }
}

cancelApproval.addEventListener("click", () => {
    approvalFormSection.hidden = true;
    selectedSubmissionId = null;
});

async function rejectSubmission(submissionId) {
    
    const confirmReject = confirm(
    "Are you sure you want to reject this property submission?"
    );

    if (!confirmReject) {
        return;
    }


    try {
        await updateDoc(doc(db, "submissions", submissionId), {
            status: "rejected",
            reviewedAt: serverTimestamp()
        });

        console.log("Submission rejected!");

        await loadPendingSubmissions();

    } catch (error) {
        console.error("Error rejecting submission:", error);
    }
}


approvalForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!selectedSubmissionId) {
        console.error("No submission selected!");
        return;
    }

    const accommodationType =
        document.getElementById("accommodation-type").value.trim();

    const monthlyPrice =
        Number(document.getElementById("monthly-price").value);

    const availability =
        document.getElementById("availability").value.trim();

    const facilities =
        document.getElementById("facilities").value
            .split(",")
            .map(facility => facility.trim())
            .filter(facility => facility !== "");

        const roomOptions = [];

    const roomDivs = document.querySelectorAll(".room-option");

       roomDivs.forEach((roomDiv) => {
        const roomName = roomDiv.querySelector(".room-name").value.trim();

        const roomPrice = Number(
            roomDiv.querySelector(".room-price").value
        );

        roomOptions.push({
            name: roomName,
            price: roomPrice,
            available: true
        });
    });

    // VALIDATE APPROVAL FORM

    if (!accommodationType) {
        alert("Please enter the accommodation type.");
        return;
    }

    if (!Number.isFinite(monthlyPrice) || monthlyPrice <= 0) {
        alert("Please enter a valid monthly price.");
        return;
    }

    if (!availability) {
        alert("Please enter the availability.");
        return;
    }

    if (facilities.length === 0) {
        alert("Please enter at least one facility.");
        return;
    }

    if (roomOptions.length === 0) {
        alert("Please add at least one room option.");
        return;
    }

    const invalidRoom = roomOptions.some(room =>
        !room.name || !Number.isFinite(room.price) || room.price <= 0
    );

    if (invalidRoom) {
        alert("Please check that every room has a name and a valid price.");
        return;
    }

 

    const confirmPublish = confirm(
    "Are you sure you want to publish this accommodation? It will become visible to students."
    );

    if (!confirmPublish) {
        return;
    }

   try {
    const submissionRef = doc(db, "submissions", selectedSubmissionId);

    const submissionSnapshot = await getDoc(submissionRef);
    const submission = submissionSnapshot.data();

    const batch = writeBatch(db);

    const accommodationRef = doc(collection(db, "accommodations"));

    batch.set(accommodationRef, {
        title: submission.propertyTitle,
        location: submission.location,
        accommodationType,
        monthlyPrice,
        availability,
        facilities,
        description: submission.description,
        contact: submission.landlordPhone,
        rooms: roomOptions,
        image: "",
        status: "approved",
        submittedAt: submission.submittedAt
    });

    batch.update(submissionRef, {
        status: "approved",
        reviewedAt: serverTimestamp()
    });

    await batch.commit();

    adminMessage.textContent = "Accommodation published successfully!";
    adminMessage.style.color = "green";

    approvalForm.reset();
    approvalFormSection.hidden = true;
    selectedSubmissionId = null;

    await loadPendingSubmissions();

} catch (error) {
    console.error("Error publishing accommodation:", error);

    adminMessage.textContent =
        "Unable to publish accommodation. Please try again.";

    adminMessage.style.color = "red";
}
});
