// script.js

// بعض الداتا التجريبية
let groups = [
    { name: "Web Development", details: "Every Monday 5PM" },
    { name: "Math Group", details: "Wednesday 3PM" },
    { name: "Cloud Computing", details: "Friday 6PM" }
  ];
  
  const groupList = document.getElementById('groupList');
  const searchInput = document.getElementById('searchInput');
  const filterSelect = document.getElementById('filterSelect');
  const sortSelect = document.getElementById('sortSelect');
  const addGroupBtn = document.getElementById('addGroupBtn');
  const createForm = document.getElementById('createForm');
  const newGroupForm = document.getElementById('newGroupForm');
  const cancelForm = document.getElementById('cancelForm');
  const detailView = document.getElementById('detailView');
  const detailName = document.getElementById('detailName');
  const detailDescription = document.getElementById('detailDescription');
  const backToList = document.getElementById('backToList');
  
  function renderGroups() {
    groupList.innerHTML = '';
  
    let filteredGroups = groups.filter(group => {
      const searchTerm = searchInput.value.toLowerCase();
      const filterTerm = filterSelect.value;
  
      const matchesSearch = group.name.toLowerCase().includes(searchTerm);
      const matchesFilter = filterTerm === '' || group.name === filterTerm;
  
      return matchesSearch && matchesFilter;
    });
  
    // ترتيب حسب الاسم أو الوقت
    if (sortSelect.value === 'name') {
      filteredGroups.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortSelect.value === 'time') {
      filteredGroups.sort((a, b) => a.details.localeCompare(b.details));
    }
  
    filteredGroups.forEach((group, index) => {
      const card = document.createElement('div');
      card.className = 'card cursor-pointer';
      card.innerHTML = `
        <h3 class="text-xl font-bold mb-2">${group.name}</h3>
        <p class="text-gray-600">${group.details}</p>
      `;
      card.onclick = () => showDetails(group);
      groupList.appendChild(card);
    });
  }
  
  function showDetails(group) {
    detailView.classList.remove('hidden');
    groupList.parentElement.classList.add('hidden'); // يخفي كل القائمة
    detailName.textContent = group.name;
    detailDescription.textContent = group.details;
  }
  
  function hideDetails() {
    detailView.classList.add('hidden');
    groupList.parentElement.classList.remove('hidden');
  }
  
  // الأحداث
  searchInput.addEventListener('input', renderGroups);
  filterSelect.addEventListener('change', renderGroups);
  sortSelect.addEventListener('change', renderGroups);
  
  addGroupBtn.addEventListener('click', () => {
    createForm.classList.remove('hidden');
    groupList.parentElement.classList.add('hidden');
  });
  
  cancelForm.addEventListener('click', () => {
    createForm.classList.add('hidden');
    groupList.parentElement.classList.remove('hidden');
  });
  
  newGroupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('groupName').value.trim();
    const details = document.getElementById('groupDetails').value.trim();
  
    if (name && details) {
      groups.push({ name, details });
      renderGroups();
      newGroupForm.reset();
      createForm.classList.add('hidden');
      groupList.parentElement.classList.remove('hidden');
    }
  });
  
  backToList.addEventListener('click', hideDetails);
  
  // أول مرة عرض القروبات
  renderGroups();
  