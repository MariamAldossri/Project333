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