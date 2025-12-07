// Menu items with egg counts (based on typical breakfast restaurant items)
const menuItems = {
    'Scrambled Eggs': 2,
    'Fried Eggs': 2,
    'Poached Eggs': 2,
    'Eggs Benedict': 2,
    'Omelet': 3,
    'Western Omelet': 3,
    'Denver Omelet': 3,
    'Breakfast Burrito': 2,
    'Egg Sandwich': 1,
    'Bacon & Eggs': 2,
    'Sausage & Eggs': 2,
    'Pancakes & Eggs': 2,
    'French Toast & Eggs': 2,
    'Steak & Eggs': 2,
    'Egg White Omelet': 3,
    'Veggie Omelet': 3,
    'Huevos Rancheros': 2,
    'Eggs Florentine': 2,
    'Quiche': 4,
    'Frittata': 4,
    'Eggs & Hash Browns': 2,
    'Country Breakfast': 2,
    'Farmers Breakfast': 3,
    'Big Breakfast': 3,
    'Kids Scrambled Eggs': 1,
    'Egg Salad Sandwich': 2,
    'Deviled Eggs': 2,
    'Egg McMuffin Style': 1,
    'Breakfast Bowl': 2,
    'Loaded Omelet': 4
};

// Sample customer names
const customerNames = [
    'John Smith', 'Mary Johnson', 'Robert Williams', 'Patricia Brown',
    'Michael Jones', 'Jennifer Garcia', 'William Miller', 'Linda Davis',
    'David Rodriguez', 'Elizabeth Martinez', 'Richard Anderson', 'Susan Taylor',
    'Joseph Thomas', 'Jessica Jackson', 'Thomas White', 'Sarah Harris',
    'Christopher Martin', 'Karen Thompson', 'Daniel Garcia', 'Nancy Martinez',
    'Matthew Robinson', 'Betty Clark', 'Anthony Rodriguez', 'Margaret Lewis',
    'Mark Lee', 'Dorothy Walker', 'Donald Hall', 'Lisa Allen'
];

let totalEggs = 0;
let isRunning = false;
let receiptInterval = null;
let currentReceiptId = 0;

// Initialize flap counter
function initFlapCounter() {
    updateFlapCounter(0);
}

// Update flap counter with animation
function updateFlapCounter(newTotal) {
    const counter = document.getElementById('flapCounter');
    const digits = counter.querySelectorAll('.flap-digit');
    const digitsCount = digits.length;
    let newTotalStr = String(newTotal);

    if (newTotalStr.length > digitsCount) {
        newTotalStr = newTotalStr.slice(-digitsCount); // keep least significant digits
    } else {
        newTotalStr = newTotalStr.padStart(digitsCount, '0');
    }
    
    digits.forEach((digit, index) => {
        const currentValue = parseInt(digit.dataset.value);
        const newValue = parseInt(newTotalStr[index]);
        
        if (currentValue !== newValue) {
            const currentDisplay = digit.querySelector('.flap-display.current');
            const nextDisplay = digit.querySelector('.flap-display.next');
            
            // Set the new value on the next display (which will flip up)
            nextDisplay.textContent = newValue;
            
            // Animate the flip
            digit.classList.add('flipping');
            
            setTimeout(() => {
                // After animation, swap the displays
                currentDisplay.textContent = newValue;
                currentDisplay.classList.remove('current');
                currentDisplay.classList.add('next');
                
                nextDisplay.classList.remove('next');
                nextDisplay.classList.add('current');
                
                digit.dataset.value = newValue;
                digit.classList.remove('flipping');
            }, 400);
        }
    });
}

// Generate a random receipt
function generateReceipt() {
    const numItems = Math.floor(Math.random() * 4) + 1; // 1-4 items
    const items = [];
    let receiptEggs = 0;
    
    const menuKeys = Object.keys(menuItems);
    
    for (let i = 0; i < numItems; i++) {
        const itemName = menuKeys[Math.floor(Math.random() * menuKeys.length)];
        const eggCount = menuItems[itemName];
        const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity
        
        items.push({
            name: itemName,
            quantity: quantity,
            eggs: eggCount * quantity
        });
        
        receiptEggs += eggCount * quantity;
    }
    
    const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const orderNumber = Math.floor(Math.random() * 9999) + 1;
    const date = new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    const time = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    return {
        id: currentReceiptId++,
        customer: customerName,
        orderNumber: orderNumber,
        date: date,
        time: time,
        items: items,
        totalEggs: receiptEggs
    };
}

// Display receipt
function displayReceipt(receipt) {
    const container = document.getElementById('receiptsContainer');
    const receiptDiv = document.createElement('div');
    receiptDiv.className = 'receipt';
    receiptDiv.id = `receipt-${receipt.id}`;
    
    let itemsHtml = receipt.items.map(item => 
        `<div class="receipt-item">
            ${item.quantity}x ${item.name} <span class="egg-count">(${item.eggs} eggs)</span>
        </div>`
    ).join('');
    
    receiptDiv.innerHTML = `
        <div class="receipt-header">
            EGGS UP GRILL<br>
            Order #${receipt.orderNumber}<br>
            ${receipt.date} ${receipt.time}<br>
            ${receipt.customer}
        </div>
        ${itemsHtml}
        <div class="receipt-total">
            Total Eggs: <span class="egg-count">${receipt.totalEggs}</span>
        </div>
    `;
    
    container.insertBefore(receiptDiv, container.firstChild);
    
    // Keep only last 20 receipts
    while (container.children.length > 20) {
        container.removeChild(container.lastChild);
    }
    
    // Update total and counter
    totalEggs += receipt.totalEggs;
    updateFlapCounter(totalEggs);
}

// Start simulation
function startSimulation() {
    if (isRunning) return;
    
    isRunning = true;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
    
    // Generate first receipt immediately
    const receipt = generateReceipt();
    displayReceipt(receipt);
    
    // Then generate receipts at random intervals
    receiptInterval = setInterval(() => {
        if (isRunning) {
            const receipt = generateReceipt();
            displayReceipt(receipt);
        }
    }, Math.random() * 3000 + 2000); // 2-5 seconds
}

// Stop simulation
function stopSimulation() {
    isRunning = false;
    if (receiptInterval) {
        clearInterval(receiptInterval);
        receiptInterval = null;
    }
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
}

// Reset simulation
function resetSimulation() {
    stopSimulation();
    totalEggs = 0;
    currentReceiptId = 0;
    updateFlapCounter(0);
    document.getElementById('receiptsContainer').innerHTML = '';
}

// Event listeners
document.getElementById('startBtn').addEventListener('click', startSimulation);
document.getElementById('stopBtn').addEventListener('click', stopSimulation);
document.getElementById('resetBtn').addEventListener('click', resetSimulation);

// Initialize on load
window.addEventListener('load', () => {
    initFlapCounter();
});

