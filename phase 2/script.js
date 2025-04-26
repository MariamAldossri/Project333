document.addEventListener('DOMContentLoaded', function() {
    const activitiesSection = document.querySelector('.row');
    const searchInput = document.querySelector('input[type="text"]');
    const sortNameBtn = document.querySelector('.btn.btn-info:nth-of-type(1)');
    const sortDateBtn = document.querySelector('.btn.btn-info:nth-of-type(2)');
    const createForm = document.querySelector('form');
    const detailsSection = document.getElementById('details');
    const pagination = document.querySelector('.pagination');
    
    let activities = [];
    let filteredActivities = [];
    let currentPage = 1;
    const itemsPerPage = 3;
  
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'text-center py-4';
    loadingIndicator.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>';
    activitiesSection.parentNode.insertBefore(loadingIndicator, activitiesSection);
  
    searchInput.addEventListener('input', function() {
      setTimeout(handleSearch, 300);
    });
    
    sortNameBtn.addEventListener('click', function() {
      filteredActivities.sort((a, b) => a.title.localeCompare(b.title));
      renderActivities();
    });
    
    sortDateBtn.addEventListener('click', function() {
      filteredActivities.sort((a, b) => new Date(a.date) - new Date(b.date));
      renderActivities();
    });
    
    createForm.addEventListener('submit', handleFormSubmit);
    pagination.addEventListener('click', handlePaginationClick);
  
    loadActivities();
  
    function loadActivities() {
      loadingIndicator.style.display = 'block';
      activitiesSection.style.display = 'none';
      
      setTimeout(function() {
        activities = [
          {
            id: 1,
            title: 'Photography Club Meetup',
            date: '2025-04-10',
            category: 'Arts',
            club: 'Photography Club',
            description: 'A creative walk around campus to capture beauty through lenses!',
            comments: []
          },
          {
            id: 2,
            title: 'Coding Hackathon',
            date: '2025-04-15',
            category: 'Technology',
            club: 'Coding Club',
            description: '24-hour coding competition with exciting prizes!',
            comments: []
          },
          {
            id: 3,
            title: 'Football Tournament',
            date: '2025-04-22',
            category: 'Sports',
            club: 'Sports Club',
            description: 'Annual inter-department football competition',
            comments: []
          }
        ];
        
        filteredActivities = [...activities];
        renderActivities();
        renderPagination();
        
        loadingIndicator.style.display = 'none';
        activitiesSection.style.display = 'flex';
      }, 1000);
    }
  
    function renderActivities() {
      activitiesSection.innerHTML = '';
      
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const toShow = filteredActivities.slice(start, end);
      
      if (toShow.length === 0) {
        activitiesSection.innerHTML = '<div class="col-12 text-center py-4"><p>No activities found</p></div>';
        return;
      }
      
      toShow.forEach(activity => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
          <div class="card p-3">
            <h5 class="card-title text-dark">${activity.title}</h5>
            <p class="text-muted mb-1">${new Date(activity.date).toLocaleDateString()}</p>
            <p class="text-muted mb-2">${activity.category}</p>
            <button data-id="${activity.id}" class="btn btn-primary view-details">View Details</button>
          </div>
        `;
        activitiesSection.appendChild(card);
      });
      
      document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = parseInt(this.dataset.id);
          showDetails(id);
        });
      });
    }
  
    function showDetails(id) {
      const activity = activities.find(a => a.id === id);
      if (!activity) return;
      
      detailsSection.querySelector('h5').textContent = activity.title;
      detailsSection.querySelector('p:nth-of-type(1)').innerHTML = `<strong>Club:</strong> ${activity.club}`;
      detailsSection.querySelector('p:nth-of-type(2)').innerHTML = `<strong>Date:</strong> ${new Date(activity.date).toLocaleDateString()}`;
      detailsSection.querySelector('p:nth-of-type(3)').innerHTML = `<strong>Category:</strong> ${activity.category}`;
      detailsSection.querySelector('p:nth-of-type(4)').innerHTML = `<strong>Description:</strong> ${activity.description}`;
      
      detailsSection.querySelector('.btn-warning').onclick = function() {
        editActivity(activity);
      };
      
      detailsSection.querySelector('.btn-danger').onclick = function() {
        if (confirm('Delete this activity?')) {
          activities = activities.filter(a => a.id !== id);
          filteredActivities = filteredActivities.filter(a => a.id !== id);
          renderActivities();
          renderPagination();
          detailsSection.style.display = 'none';
        }
      };
      
      detailsSection.scrollIntoView({ behavior: 'smooth' });
    }
  
    function editActivity(activity) {
      document.getElementById('clubName').value = activity.club;
      document.getElementById('activityTitle').value = activity.title;
      document.getElementById('activityDate').value = activity.date;
      document.getElementById('activityCategory').value = activity.category;
      document.getElementById('activityDescription').value = activity.description;
      
      createForm.dataset.mode = 'edit';
      createForm.dataset.id = activity.id;
      createForm.querySelector('button[type="submit"]').textContent = 'Update Activity';
      
      document.getElementById('create').scrollIntoView({ behavior: 'smooth' });
    }
  
    function handleFormSubmit(e) {
      e.preventDefault();
      
      if (!document.getElementById('clubName').value) {
        alert('Club name is required');
        return;
      }
      if (!document.getElementById('activityTitle').value) {
        alert('Activity title is required');
        return;
      }
      if (!document.getElementById('activityDate').value) {
        alert('Date is required');
        return;
      }
      if (!document.getElementById('activityCategory').value) {
        alert('Category is required');
        return;
      }
      
      const formData = {
        club: document.getElementById('clubName').value,
        title: document.getElementById('activityTitle').value,
        date: document.getElementById('activityDate').value,
        category: document.getElementById('activityCategory').value,
        description: document.getElementById('activityDescription').value
      };
      
      if (createForm.dataset.mode === 'edit') {
        const id = parseInt(createForm.dataset.id);
        const index = activities.findIndex(a => a.id === id);
        
        if (index !== -1) {
          activities[index] = { ...activities[index], ...formData };
          filteredActivities = [...activities];
          renderActivities();
          alert('Activity updated!');
        }
      } else {
        const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
        
        activities.unshift({
          id: newId,
          ...formData,
          comments: []
        });
        
        filteredActivities = [...activities];
        currentPage = 1;
        renderActivities();
        renderPagination();
        alert('Activity created!');
      }
      
      createForm.reset();
      delete createForm.dataset.mode;
      delete createForm.dataset.id;
      createForm.querySelector('button[type="submit"]').textContent = 'Submit';
    }
  
    function handleSearch() {
      const term = searchInput.value.toLowerCase();
      
      if (!term) {
        filteredActivities = [...activities];
      } else {
        filteredActivities = activities.filter(activity => 
          activity.title.toLowerCase().includes(term) ||
          activity.club.toLowerCase().includes(term) ||
          activity.category.toLowerCase().includes(term)
        );
      }
      
      currentPage = 1;
      renderActivities();
      renderPagination();
    }
  
    function renderPagination() {
      const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
      
      if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
      }
      
      pagination.style.display = 'flex';
      let html = '';
      
      html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="prev">Previous</a></li>`;
      
      for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
      }
      
      html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="next">Next</a></li>`;
      
      pagination.innerHTML = html;
    }
  
    function handlePaginationClick(e) {
      e.preventDefault();
      if (e.target.tagName !== 'A') return;
      
      const action = e.target.dataset.page;
      const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
      
      if (action === 'prev' && currentPage > 1) {
        currentPage--;
      } else if (action === 'next' && currentPage < totalPages) {
        currentPage++;
      } else if (!isNaN(action)) {
        currentPage = parseInt(action);
      }
      
      renderActivities();
      renderPagination();
    }
  });