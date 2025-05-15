
// ✅ script.js

const groups = [
  { name: "Math Masters", subject: "Math", day: "Monday", time: "5PM" },
  { name: "Web Dev Warriors", subject: "Web Development", day: "Tuesday", time: "2PM" },
  { name: "Mobile Coders", subject: "Mobile Application Development", day: "Wednesday", time: "11AM" },
  { name: "Cloud Gurus", subject: "Cloud Computing", day: "Thursday", time: "3PM" },
  { name: "IoT Innovators", subject: "Internet of Thing (IoT)", day: "Friday", time: "10AM" },
  { name: "HCI Hackers", subject: "Human Computer Interaction (HCI)", day: "Saturday", time: "4PM" },
  { name: "Big Data Brains", subject: "Big Data Analytics", day: "Sunday", time: "1PM" },
  { name: "Cyber Knights", subject: "Network Security", day: "Monday", time: "9AM" }
];

// (You can copy and paste your original JS code here unchanged.)

const groupList = document.getElementById("groupList");
const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");
const filterSubject = document.getElementById("filterSubject");
const filterDay = document.getElementById("filterDay");
const detailView = document.getElementById("detailView");
const detailTitle = document.getElementById("detailTitle");
const detailInfo = document.getElementById("detailInfo");
const backBtn = document.getElementById("backBtn");
const addCourseBtn = document.getElementById("addCourseBtn");

const addedCoursesList = document.createElement("ul");
addedCoursesList.className = "mt-6 space-y-2";
detailView.appendChild(addedCoursesList);

const addedCourses = [];

function convertTo24(timeStr) {
  const hour = parseInt(timeStr);
  const isPM = timeStr.toLowerCase().includes("pm");
  return isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
}

function renderGroups() {
  groupList.innerHTML = "";
  const viewAddedBtn = document.getElementById("viewAddedBtn");
  const addedGroupsSection = document.getElementById("addedGroupsSection");
  const addedGroupsList = document.getElementById("addedGroupsList");

  addCourseBtn.addEventListener("click", () => {
    const currentGroup = detailTitle.textContent;
    let stored = JSON.parse(localStorage.getItem("myGroups")) || [];

    if (!stored.includes(currentGroup)) {
      stored.push(currentGroup);
      localStorage.setItem("myGroups", JSON.stringify(stored));
      alert("Group added!");

      const group = {
        name: detailTitle.textContent,
        subject: detailInfo.textContent.split(" — ")[0],
        day: detailInfo.textContent.split(" — ")[1].split(" at ")[0].trim(),
        time: detailInfo.textContent.split(" at ")[1].trim(),
      };

      fetch("create-group.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(group)
      })
      .then(res => res.json())
      .then(result => {
        if (result.status === "success") {
          console.log("Group saved to database ✅");
        } else {
          console.error(result);
          alert("Failed to save to database ❌");
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
        alert("Error connecting to server.");
      });

    } else {
      alert("Already added.");
    }
  });

  viewAddedBtn.addEventListener("click", () => {
    const stored = JSON.parse(localStorage.getItem("myGroups")) || [];
    addedGroupsList.innerHTML = "";

    if (stored.length === 0) {
      addedGroupsList.innerHTML = "<p class='text-gray-500'>No groups added yet.</p>";
    } else {
      stored.forEach(name => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center bg-white p-3 rounded shadow";
        li.innerHTML = `
          <span>${name}</span>
          <button class="btn-info px-3 py-1 rounded" data-name="${name}">Delete</button>
        `;
        addedGroupsList.appendChild(li);
      });
    }

    addedGroupsSection.classList.remove("hidden");
  });

  addedGroupsList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const name = e.target.dataset.name;
      let stored = JSON.parse(localStorage.getItem("myGroups")) || [];
      stored = stored.filter(g => g !== name);
      localStorage.setItem("myGroups", JSON.stringify(stored));
      e.target.parentElement.remove();
    }
  });

  const searchQuery = searchInput.value.toLowerCase();
  const selectedSubject = filterSubject.value;
  const selectedDay = filterDay.value;

  const filtered = groups.filter(group => {
    const matchesSearch = group.subject.toLowerCase().includes(searchQuery);
    const matchesSubject = selectedSubject === "" || group.subject === selectedSubject;
    const matchesDay = selectedDay === "" || group.day === selectedDay;

    const hour = parseInt(group.time);
    const isAM = group.time.toLowerCase().includes("am");
    const time24 = isAM ? hour : (hour < 12 ? hour + 12 : hour);
    const isValidTime = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"].includes(group.day)
      ? (time24 >= 9 && time24 <= 18)
      : true;

    return matchesSearch && matchesSubject && matchesDay && isValidTime;
  });

  filtered.forEach(group => {
    const card = document.createElement("div");
    card.className = "card cursor-pointer";
    card.innerHTML = `
      <h3 class="text-xl font-bold mb-2">${group.name}</h3>
      <p class="text-gray-600">${group.day} ${group.time}</p>
    `;
    card.addEventListener("click", () => showDetail(group));
    groupList.appendChild(card);
  });
}

function showDetail(group) {
  detailTitle.textContent = group.name;
  detailInfo.textContent = `${group.subject} — ${group.day} at ${group.time}`;
  detailView.classList.remove("hidden");
  groupList.classList.add("hidden");
  addCourseBtn.classList.remove("hidden");

  addCourseBtn.onclick = () => {
    const exists = addedCourses.some(c => c.name === group.name);
    if (!exists) {
      addedCourses.push(group);
      updateAddedCoursesUI();
    }
  };
}

function updateAddedCoursesUI() {
  addedCoursesList.innerHTML = "";

  if (addedCourses.length > 0) {
    const title = document.createElement("h3");
    title.textContent = "My Added Courses:";
    title.className = "text-xl font-semibold mb-2";
    addedCoursesList.appendChild(title);
  }

  addedCourses.forEach((course, index) => {
    const item = document.createElement("li");
    item.className = "flex justify-between items-center bg-gray-100 p-3 rounded";
    item.innerHTML = `
      <span>${course.name} - ${course.day} at ${course.time}</span>
      <button class="btn-info p-2 rounded text-sm" data-index="${index}">Delete</button>
    `;
    item.querySelector("button").onclick = () => {
      addedCourses.splice(index, 1);
      updateAddedCoursesUI();
    };
    addedCoursesList.appendChild(item);
  });
}

backBtn.addEventListener("click", () => {
  detailView.classList.add("hidden");
  groupList.classList.remove("hidden");
  addCourseBtn.classList.add("hidden");
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  suggestions.innerHTML = "";

  if (query.length === 0) {
    suggestions.classList.add("hidden");
    return;
  }

  const subjectList = [
    "Math", "Web Development", "Mobile Application Development", "Cloud Computing",
    "Internet of Thing (IoT)", "Human Computer Interaction (HCI)", "Big Data Analytics",
    "Computer Architecture", "IT Governance", "Network Security", "Ethical Hacking", "Enterprise System"
  ];

  const matches = subjectList.filter(sub => sub.toLowerCase().startsWith(query));
  if (matches.length === 0) {
    suggestions.classList.add("hidden");
    return;
  }

  matches.forEach(sub => {
    const li = document.createElement("li");
    li.textContent = sub;
    li.className = "p-2 hover:bg-gray-100 cursor-pointer";
    li.onclick = () => {
      searchInput.value = sub;
      suggestions.classList.add("hidden");
      renderGroups();
    };
    suggestions.appendChild(li);
  });

  suggestions.classList.remove("hidden");
});

document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
    suggestions.classList.add("hidden");
  }
});

searchInput.addEventListener("input", renderGroups);
filterSubject.addEventListener("change", renderGroups);
filterDay.addEventListener("change", renderGroups);

renderGroups();

function addGroup(group) {
  fetch("create-group.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(group)
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      alert("Group added!");
      fetchGroups();
    }
  });
}

function fetchGroups() {
  fetch("get-groups.php")
    .then(res => res.json())
    .then(data => {
      groups = data;
      renderGroups();
    });
}
