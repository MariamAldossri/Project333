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