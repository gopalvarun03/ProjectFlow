class Contact {
    constructor(name, lastSeen, messages, phone, bio, media) {
        this.name = name;
        this.lastSeen = lastSeen;
        this.messages = messages;
        this.phone = phone;
        this.bio = bio;
        this.media = media;
    }
}

const contactsData = [
    new Contact(
        'Varun Gopal CoE',
        'last seen 3 minutes ago',
        [
            { text: 'Hello!', type: 'received', time: '23:11', seen: true },
            { text: 'How are you doing?', type: 'sent', time: '23:12', seen: true },
            { text: 'I am doing great, thanks for asking!', type: 'received', time: '23:15', seen: true }
        ],
        '+91 77939 68758',
        'One of a kind',
        ['image1.jpg', 'image2.jpg']
    ),
    new Contact(
        'Clg Student',
        'last seen 24 minutes ago',
        [
            { text: 'Hey there!', type: 'received', time: '14:30', seen: true },
            { text: 'Hello! What\'s up?', type: 'sent', time: '14:35', seen: true },
            { text: 'Not much, just chilling.', type: 'received', time: '14:37', seen: true }
        ],
        '+91 23456 78901',
        'Student',
        ['image3.jpg', 'image4.jpg']
    ),
    // Add more dummy contacts as needed
];

let currentChat = null;

// Load contacts into the sidebar
function loadContacts() {
    const contactsContainer = document.getElementById('contacts');
    let contactsData2={};
    fetch("/userfriends")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        contactsData2 = data['details']['users'];
        console.log(data['details']);
        contactsData2.forEach(c => {
            const contactElement = document.createElement('div');
            contactElement.className = 'contact';
            contactElement.id=c;
            contactElement.innerHTML = `
                <div class="profile-pic" style="background-color: ${getRandomColor()}"></div>
                <div class="contact-info">
                    <div class="contact-name">${c}</div>
                    <div class="contact-status">Last seen</div>
                </div>
            `;
            contactElement.onclick = () => openChat(c);
            contactsContainer.appendChild(contactElement);
        });
    })
    .catch(err => {
        console.error(err);
    });



    contactsData.forEach((contact, index) => {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact';
        contactElement.innerHTML = `
            <div class="profile-pic" style="background-color: ${getRandomColor()}"></div>
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-status">${contact.lastSeen}</div>
            </div>
        `;
        contactElement.onclick = () => openChat(index);
        contactsContainer.appendChild(contactElement);
    });


}

// // Open a chat with the selected contact
// function openChat(index) {
//     currentChat = contactsData[index];
//     const chatHeader = document.getElementById('chatHeader');
//     const chatBody = document.getElementById('chatBody');

//     document.getElementById('chatContactName').textContent = currentChat.name;
//     document.getElementById('chatContactStatus').textContent = currentChat.lastSeen;
//     document.getElementById('chatProfilePic').style.backgroundColor = getRandomColor();

//     chatBody.innerHTML = '';
//     currentChat.messages.forEach(message => {
//         const messageElement = document.createElement('div');
//         messageElement.className = `message ${message.type}`;
//         messageElement.textContent = message.text;
//         messageElement.setAttribute('data-time', `${message.time} ${message.seen ? '✓✓' : '✓'}`);
//         chatBody.appendChild(messageElement);
//     });

//     if (window.innerWidth < 768) {
//         document.getElementById('sidebar').style.display = 'none';
//     }
// }

function openChat(enduser) {
    // currentChat = contactsData.find(contact => contact.id === enduser);
    const chatHeader = document.getElementById('chatHeader');
    const chatBody = document.getElementById('chatBody');

    document.getElementById('chatContactName').textContent = enduser;
    // document.getElementById('chatContactStatus').textContent = currentChat.lastSeen;
    document.getElementById('chatProfilePic').style.backgroundColor = getRandomColor();

    fetchMessages(enduser); // Call to fetch messages from the server

    // if (window.innerWidth < 768) {
    //     document.getElementById('sidebar').style.display = 'none';
    // }
}

function fetchMessages(enduser) {
    console.log("End user ",enduser);
    fetch('/getmessages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ endusert: enduser })
    })
    .then(response => response.json())
    .then(data => {
        const chatBody = document.getElementById('chatBody');
        chatBody.innerHTML = '';

        if (data.list) {
            data.list.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.className = `message ${message.fr === 0 ? 'sent' : 'received'}`;
                messageElement.textContent = message.msg;
                chatBody.appendChild(messageElement);
            });
        }
        console.log(data);
        console.log(data.list);

    })
    .catch(error => {
        console.error('Error fetching messages:', error);
    });
}




// Toggle user info panel
function toggleUserInfo(show) {
    const userInfo = document.getElementById('userInfo');
    if (show) {
        // Load user info
        document.getElementById('userProfilePic').style.backgroundColor = getRandomColor();
        document.getElementById('userName').textContent = currentChat.name;
        document.getElementById('userStatus').textContent = currentChat.lastSeen;
        document.getElementById('userPhone').textContent = currentChat.phone;
        document.getElementById('userBio').textContent = currentChat.bio;

        const userMedia = document.getElementById('userMedia');
        userMedia.innerHTML = '';
        currentChat.media.forEach(media => {
            const mediaElement = document.createElement('img');
            mediaElement.src = media;
            userMedia.appendChild(mediaElement);
        });

        userInfo.style.display = 'flex';
    } else {
        userInfo.style.display = 'none';
    }
}

// Send a message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    if (messageText && currentChat) {
        const message = { text: messageText, type: 'sent', time: '23:30', seen: false };
        currentChat.messages.push(message);
        openChat(contactsData.indexOf(currentChat));
        messageInput.value = '';
    }
}

// Handle enter key to send message
function handleKeyDown(event) {
    if (event.key === 'Enter') {
        sendMessage();
        event.preventDefault();
    }
}

// Search contacts
function searchContacts() {
    const searchQuery = document.querySelector('.search-bar').value.toLowerCase();
    const contactsContainer = document.getElementById('contacts');

    contactsContainer.innerHTML = '';


    fetch("/userfriends")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let contactsData2 = data['details']['users'];
        console.log(data['details']);
        contactsData2.forEach(c => {
            if (c.toLowerCase().includes(searchQuery)){
            const contactElement = document.createElement('div');
            contactElement.className = 'contact';
            contactElement.id=c;
            contactElement.innerHTML = `
                <div class="profile-pic" style="background-color: ${getRandomColor()}"></div>
                <div class="contact-info">
                    <div class="contact-name">${c}</div>
                    <div class="contact-status">Last seen</div>
                </div>
            `;
            contactElement.onclick = () => openChat(c);
            contactsContainer.appendChild(contactElement);
            }
        });
    })




    // contactsData2.forEach((contact, index) => {
    //     if (contact.name.toLowerCase().includes(searchQuery)) {
    //         const contactElement = document.createElement('div');
    //         contactElement.className = 'contact';
    //         contactElement.innerHTML = `
    //             <div class="profile-pic" style="background-color: ${getRandomColor()}"></div>
    //             <div class="contact-info">
    //                 <div class="contact-name">${contact.name}</div>
    //                 <div class="contact-status">last seen</div>
    //             </div>
    //         `;
    //         contactElement.onclick = () => openChat(index);
    //         contactsContainer.appendChild(contactElement);
    //     }
    // });
}

// Generate a random color for profile pictures
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Toggle sidebar for smaller screens
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.display === 'none' || !sidebar.style.display) {
        sidebar.style.display = 'flex';
        document.getElementById('chatContainer').style.display = 'none';
    } else {
        sidebar.style.display = 'none';
        document.getElementById('chatContainer').style.display = 'flex';
    }
}

// Initialize the chat app
document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
});
