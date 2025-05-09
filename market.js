const apiURL = 'https://jsonplaceholder.typicode.com/posts';
let items = [];

async function fetchData() {
  try {
    showLoading(true);
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error('Failed to fetch the data');
    const data = await response.json();
    items = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.body,
      price: Math.floor(Math.random() * 100) + 1
    }));
    displayItems(items);
    setupPagination(items);
  } catch (error) {
    console.error('error:', error);
    alert('An error occurred while fetching the data..');
  } finally {
    showLoading(false);
  }
}

function showLoading(isLoading) {
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = isLoading ? 'block' : 'none';
}

function displayItems(data) {
  const itemList = document.getElementById('item-list');
  itemList.innerHTML = '';

  data.forEach(item => {
    const card = document.createElement('div');card.classList.add('card');
    card.innerHTML = `
      <img src="https://via.placeholder.com/200" alt="item image ">
      <div class="details">
        <h3>item.title</h3>
        <p>{item.description}</p>
        <p>السعر: 
    item.price</p>
            <button onclick="viewDetails(item.id)">show details</button>
          </div>
        `;
        itemList.appendChild(card);
      );
    
    
    function setupPagination(data) 
      const itemsPerPage = 10;
      const totalPages = Math.ceil(data.length / itemsPerPage);
      const pagination = document.getElementById('pagination');
      pagination.innerHTML = ”;
    
      for (let i = 1; i <= totalPages; i++) 
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.addEventListener('click', () => 
          const start = (i - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          displayItems(data.slice(start, end));
        );
        pagination.appendChild(btn);
      
    
      displayItems(data.slice(0, itemsPerPage));
    
    
    function viewDetails(id) 
      const item = items.find(item => item.id === id);
      if (item) 
        alert(`item details :: item.title:item.description:
{item.price}`);
  }
}