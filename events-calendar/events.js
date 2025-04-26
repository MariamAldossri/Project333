const eventsContainer = document.querySelector('.row');
const searchInput = document.querySelector('input[aria-label="Search"]');
const sortDateBtn = document.querySelectorAll('.btn-info')[0];
const sortPopularityBtn = document.querySelectorAll('.btn-info')[1];
const paginationContainer = document.querySelector('.pagination');
const eventForm = document.querySelector('form');

let eventsData = [];
let filteredData = [];
let currentPage = 1;
const eventsPerPage = 3;
async function fetchEvents() {
    try {
        showLoading();
        const response = await fetch('https://mockapi.io/projects/662d9a46a7afac45f5bde82b/events'); // Sample link (you can create your own dummy API)
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        eventsData = data;
        filteredData = [...eventsData];
        renderEvents();
        renderPagination();
    } catch (error) {
        console.error('Error fetching events:', error);
        showError('Failed to load events. Please try again later.');
    } finally {
        hideLoading();
    }
}
function showLoading() {
    eventsContainer.innerHTML = `<div class="text-center w-100">Loading...</div>`;
}

function hideLoading() {
}

function showError(message) {
    eventsContainer.innerHTML = `<div class="text-danger w-100 text-center">${message}</div>`;
}
function renderEvents() {
    const start = (currentPage - 1) * eventsPerPage;
    const end = start + eventsPerPage;
    const paginatedEvents = filteredData.slice(start, end);

    eventsContainer.innerHTML = '';

    if (paginatedEvents.length === 0) {
        eventsContainer.innerHTML = `<div class="text-center w-100">No events found.</div>`;
        return;
    }

    paginatedEvents.forEach(event => {
        const eventCard = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text">Date: ${event.date}</p>
                        <p class="card-text">Location: ${event.location}</p>
                        <a href="event-detail.html" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            </div>
        `;
        eventsContainer.insertAdjacentHTML('beforeend', eventCard);
    });
}
searchInput.addEventListener('input', function (e) {
    const query = e.target.value.toLowerCase();
    filteredData = eventsData.filter(event =>
        event.title.toLowerCase().includes(query)
    );
    currentPage = 1;
    renderEvents();
    renderPagination();
});
sortDateBtn.addEventListener('click', () => {
    filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
    currentPage = 1;
    renderEvents();
});

sortPopularityBtn.addEventListener('click', () => {
    filteredData.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)); // Default popularity if missing
    currentPage = 1;
    renderEvents();
});
function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / eventsPerPage);

    paginationContainer.innerHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.innerHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }

    paginationContainer.innerHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    `;
}

window.changePage = function (page) {
    if (page < 1 || page > Math.ceil(filteredData.length / eventsPerPage)) return;
    currentPage = page;
    renderEvents();
    renderPagination();
}
eventForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value.trim();
    const location = document.getElementById('eventLocation').value.trim();

    if (!title || !date || !location) {
        alert('Please fill all required fields!');
        return;
    }

    if (new Date(date) < new Date()) {
        alert('Please select a future date!');
        return;
    }

    alert('Event successfully validated (not submitted).');
});

// Initialize
fetchEvents();