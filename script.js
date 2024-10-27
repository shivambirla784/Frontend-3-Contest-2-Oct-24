// script.js

// Menu data with all items from your JSON
const menuData = [
    {
        "id": 1,
        "name": "Cheeseburger",
        "price": 5.99,
        "imgSrc": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=2015&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        "id": 2,
        "name": "Pizza",
        "price": 8.99,
        "imgSrc": "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        "id": 3,
        "name": "Tacos",
        "price": 3.99,
        "imgSrc": "https://plus.unsplash.com/premium_photo-1681406994498-e2f24136108c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        "id": 4,
        "name": "Sushi",
        "price": 11.99,
        "imgSrc": "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        "id": 5,
        "name": "Pasta",
        "price": 9.99,
        "imgSrc": "https://plus.unsplash.com/premium_photo-1664472619078-9db415ebef44?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
];

let currentMenuItems = [...menuData]; // Keep track of currently displayed items

// Function 1: Get Menu
function getMenu() {
    try {
        renderMenu(menuData);
    } catch (error) {
        console.error('Error loading menu:', error);
        showStatus('Error loading menu. Please try again later.');
    }
}

// Function to render menu items
function renderMenu(items) {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = ''; // Clear existing content

    if (items.length === 0) {
        menuContainer.innerHTML = '<p class="no-results">No items found matching your search.</p>';
        return;
    }

    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/400x300?text=Food+Image'">
            <div class="menu-item-details">
                <div class="menu-item-info">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <button class="add-to-cart" onclick="addToOrder(${item.id})">+</button>
            </div>
        `;
        menuContainer.appendChild(menuItem);
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');

    // Search on button click
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    // Search on enter key
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });

    // Live search as user types (optional)
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });
}

// Perform search
function performSearch(searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    if (normalizedSearch === '') {
        currentMenuItems = [...menuData];
    } else {
        currentMenuItems = menuData.filter(item => 
            item.name.toLowerCase().includes(normalizedSearch)
        );
    }
    
    renderMenu(currentMenuItems);
}

// Function 2: Take Order
function takeOrder() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Randomly select 3 burgers
            const burgers = menuData
                .filter(item => item.name.toLowerCase().includes('burger'))
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            
            resolve({
                orderedItems: burgers,
                totalAmount: burgers.reduce((sum, burger) => sum + burger.price, 0)
            });
        }, 2500);
    });
}

// Function 3: Order Preparation
function orderPrep() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ order_status: true, paid: false });
        }, 1500);
    });
}

// Function 4: Pay Order
function payOrder() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ order_status: true, paid: true });
        }, 1000);
    });
}

// Function 5: Thank You
function thankyouFnc() {
    alert('Thank you for eating with us today!');
}

// Helper function to show status
function showStatus(message) {
    const modal = document.getElementById('status-modal');
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = message;
    modal.classList.add('show');
}

// Helper function to hide status
function hideStatus() {
    const modal = document.getElementById('status-modal');
    modal.classList.remove('show');
}

// Add to order function
function addToOrder(itemId) {
    const item = menuData.find(item => item.id === itemId);
    if (item) {
        showStatus(`Added ${item.name} to your order!`);
        setTimeout(hideStatus, 2000);
    }
}

// Main order processing function
async function startOrder() {
    try {
        // Take order
        showStatus('Processing your order...');
        const order = await takeOrder();
        
        // Prepare order
        showStatus('Preparing your food...');
        const prepStatus = await orderPrep();
        
        // Process payment
        showStatus('Processing payment...');
        const paymentStatus = await payOrder();
        
        // Complete order
        if (paymentStatus.paid) {
            hideStatus();
            thankyouFnc();
        }
    } catch (error) {
        console.error('Error processing order:', error);
        showStatus('Error processing your order. Please try again.');
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    getMenu();
    setupSearch();
});