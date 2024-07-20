// Select necessary DOM elements
const chatInput = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.send-button');
const chatMessages = document.querySelector('.chat-messages');
const contacts = document.querySelectorAll('.contact');
const menuItems = document.querySelectorAll('.menu-item');
const chatPartner = document.querySelector('.chat-partner');
const chatStatus = document.querySelector('.chat-status');
const profileName = document.querySelector('.profile-name');
const profileInfo = document.querySelector('.profile-info');

// Function to send a message
function sendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText !== '') {
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        messageElement.textContent = messageText;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
        chatInput.value = ''; // Clear input field
    }
}

// Add event listener for the send button
sendButton.addEventListener('click', sendMessage);

// Add event listener for pressing Enter key in the input field
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Function to switch active contact
function switchContact(contact) {
    contacts.forEach(c => c.classList.remove('active'));
    contact.classList.add('active');
    // Clear current messages
    chatMessages.innerHTML = '';
    // Load new chat messages for this contact (customize this part)
    const receivedMessage = document.createElement('div');
    receivedMessage.className = 'message received';
    receivedMessage.textContent = 'New messages loaded for ' + contact.querySelector('.contact-name').textContent;
    chatMessages.appendChild(receivedMessage);
    
    // Update chat partner details
    chatPartner.textContent = contact.querySelector('.contact-name').textContent;
    chatStatus.textContent = contact.dataset.lastSeen || 'En ligne';

    // Update profile info dynamically
    profileName.textContent = contact.querySelector('.contact-name').textContent;
    profileInfo.innerHTML = `
        <div class="profile-detail"><strong>Nom:</strong> ${contact.querySelector('.contact-name').textContent}</div>
        <div class="profile-detail"><strong>Email:</strong> ${contact.querySelector('.contact-name').textContent.toLowerCase().replace(' ', '.')}@example.com</div>
        <div class="profile-detail"><strong>Téléphone:</strong> +33 6 12 34 56 78</div>
    `;
}

// Add event listener for switching contacts
contacts.forEach(contact => {
    contact.addEventListener('click', () => switchContact(contact));
});

// Function to switch active menu item
function switchMenuItem(menuItem) {
    menuItems.forEach(item => item.classList.remove('active'));
    menuItem.classList.add('active');
    // Additional logic for switching views can be added here
}

// Add event listener for switching menu items
menuItems.forEach(menuItem => {
    menuItem.addEventListener('click', () => switchMenuItem(menuItem));
});
