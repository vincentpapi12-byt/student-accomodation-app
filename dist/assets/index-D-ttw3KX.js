(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),((e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports))((()=>{var e=document.querySelector(`.search-form`),t=document.querySelector(`[type="search"]`),n=document.querySelector(`.search-message`),r=document.getElementById(`accommodation-list`),i=document.getElementById(`listings`),a=document.getElementById(`residence-details`),o=document.getElementById(`details-content`),s=document.getElementById(`back-to-listings`),c=[`unit a`,`unit b`,`unit c`,`unit d`,`unit e`,`unit f`,`gate 1`,`gate 2`,`gate 3`],l=[{location:`gate 2`,title:`Example Student Residence`,price:2500,accommodationType:`Student Residence`,contact:`Contact details coming soon`,description:`Description coming soon`,facilities:[`Wi-Fi`,`Laundry`,`Study area`],image:`public/images/residence-example.jpg`}];e.addEventListener(`submit`,function(e){e.preventDefault();let s=t.value.trim(),u=s.toLowerCase();if(n.textContent=``,r.innerHTML=``,i.hidden=!0,s===``){n.textContent=`Please enter a location.`;return}if(!c.includes(u)){n.textContent=`Location not found. Try Unit A or Gate 2.`;return}let d=l.filter(e=>e.location===u);i.hidden=!1,d.length>0?(n.textContent=`Showing residences in ${s}`,d.forEach(e=>{r.innerHTML+=`
                <article class="accommodation-card">
                    <img
                        src="${e.image}"
                        alt="Photo of ${e.title}"
                       class="residence-image"
                    >
                    <h3>${e.title}</h3>
                    <p>Location: ${e.location}</p>
                    <p>Price: R${e.price.toLocaleString()} per month</p>
                    <p>Type: ${e.accommodationType}</p>
                    <button class="details-button" type="button">View Details</button>
                </article>
            `}),r.querySelectorAll(`.details-button`).forEach((e,t)=>{e.addEventListener(`click`,function(){let e=d[t];o.innerHTML=`
    <article class="accommodation-card">
        <img
            src="${e.image}"
            alt="Photo of ${e.title}"
            class="residence-image"
        >

        <h2>${e.title}</h2>

        <p>${e.description}</p>

        <p>
            <strong>Location:</strong>
            ${e.location}
        </p>

        <p>
            <strong>Price:</strong>
            R${e.price.toLocaleString()} per month
        </p>

        <p>
            <strong>Type:</strong>
            ${e.accommodationType}
        </p>

        <p>
            <strong>Contact:</strong>
            ${e.contact}
        </p>

        <h3>Facilities</h3>

        <ul>
            ${e.facilities.map(e=>`<li>${e}</li>`).join(``)}
        </ul>
    </article>
`,i.hidden=!0,a.hidden=!1})})):n.textContent=`No residences currently listed for ${s}.`}),s.addEventListener(`click`,function(){a.hidden=!0,i.hidden=!1})}))();