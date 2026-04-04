fetch("./data/projects.json")
  .then((response) => response.json())
  .then((json) => {
    document.querySelector("#project_count").innerHTML =
      json.projects.length + "+";
    let projectsDiv = document.querySelector(
      "#resume > div > div > div.resume-timeline"
    );
    for (let p of json.projects) {
      projectsDiv.insertAdjacentHTML(
        "beforeend",
        `<div class="item scroll-animation" data-animation="fade_from_right">
        <span class="date">${p.startDate + " ~ " + p.endDate}</span>
        <h2>${p.name}</h2>
        <p>${p.description}</p>
    </div>`
      );
    }
  });

fetch("./data/teams.json")
  .then((response) => response.json())
  .then((json) => {
    let teamsDiv = document.querySelector(
      "#skills > div > div > div.row.skills.text-center"
    );
    let teamsDiv2 = document.querySelector("#pricing > div > div > div > div");
    for (let t of json.teams) {
      teamsDiv.insertAdjacentHTML(
        "beforeend",
        `<div class="col-md-3 scroll-animation" data-animation="fade_from_left">
        <a href=${t.link}>  
          <div class="skill">
            <div class="skill-inner">
                <img id="team-photo" src="assets/images/${t.imageURL}">
                <h1 class="percent">${t.name}</h1>
            </div>
            <p class="name">${t.competitions[0]}</p>
          </div>
        </a>
    </div>`
      );
      let teamMembersHTML = "";
      for (const m of t.members) {
        teamMembersHTML += `<li>${m}</li>`;
      }
      
      teamsDiv2.insertAdjacentHTML(
        "beforeend",
        `
        `
        /*
        `
        <div class="col-md-6 scroll-animation" data-animation="fade_from_left">
                      <div class="pricing-table">
                        <div class="pricing-table-header">
                          <div class="top d-flex justify-content-between align-items-start">
                            <h4>${t.date}</h4>
                            <p class="text-right">
                            ${t.competitions[0]}
                            </p>
                          </div>
                          <h1>${t.name}</h1>
                        </div>
                        <ul class="feature-lists">
                            ${teamMembersHTML}
                        </ul>
                      </div>
                    </div> 
        `
        */
      );
    }
  });

fetch("./data/events.json")
  .then((response) => response.json())
  .then((json) => {
    let eventsDiv = document.querySelector(
      "#portfolio > div > div > div.row.portfolio-items"
    );
    for (let e of json.events) {
      let tagsHTML = "";
      for (const t of e.tags) {
        tagsHTML += `<li>
        <span>${t}</span>
        </li>`;
      }
      eventsDiv.insertAdjacentHTML(
        "beforeend",
        `
        <div class="col-md-${
          e.type === "medium" ? "12" : "6"
        } scroll-animation" data-animation="fade_from_bottom">
        <div class="portfolio-item portfolio-half${
          e.type === "medium" ? "full" : "half"
        }">
            <div class="portfolio-item-inner">
            <a href="data/events/${e.imageURL}" data-lightbox="example-1">
                <img src="data/events/${e.imageURL}" alt="Portfolio">
            </a>

            <ul class="portfolio-categories">
                ${tagsHTML}
            </ul>
            </div>
            <h2><a href="${e.link}">${e.name}</a></h2>
        </div>
        </div>
        `
      );
    }
  });

  fetch("./data/announcements.json")
  .then((response) => response.json())
  .then((json) => {
    let announcementDiv = document.querySelector(
      "#announcements > div > div > div.services-items"
    );
    for (let p of json.announcements) {
      if(p.active == true)
      {
        announcementDiv.insertAdjacentHTML(
          "beforeend",
          `<div class="service-item scroll-animation" data-animation="fade_from_bottom">
          <span class="date">${p.startDate + " ~ " + p.endDate}</span>
          <h2><a target="_blank" href = "${p.link}">${p.header}</a></h2>
          <p>${p.description}</p>
      </div>`
        );
      }

    }
  });


  fetch("./data/applications.json")
  .then((response) => response.json())
  .then((json) => {
    let announcementDiv = document.querySelector(
      "#applications > div > div > div.services-items"
    );
    for (let p of json.applications) {
      if(p.active == true)
      {
        announcementDiv.insertAdjacentHTML(
          "beforeend",
          `<div class="service-item scroll-animation" data-animation="fade_from_bottom">
          <h2><a target="_blank" href = "${p.link}">${p.header}</a></h2>
          <br>
          <h4><a target="_blank" href = "${p.link}">Başvurmak için tıkla !!!</a></h4>
      </div>`
        );
      }

    }
  });

  fetch("./data/courses.json")
  .then((response) => response.json())
  .then((json) => {
    let coursesDiv = document.querySelector(
      "#courses > div > div > div.services-items"
    );
    for (let p of json.courses) {
      if(p.active == true){
        coursesDiv.insertAdjacentHTML(
          "beforeend",
          `<div class="service-item scroll-animation" data-animation="fade_from_bottom">
          <span class="date">${p.startsDate + " ~ " + p.endDate}</span>
          <span class="location">${p.location}</span>
          <h2><a href= "${p.link}">${p.name}</a></h2>
          <p>${p.description}</p>
          </div>`
        );
      }

    }
  });