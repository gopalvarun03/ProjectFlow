document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const message = document.getElementById('message');

    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match!';
    } else {
        message.textContent = '';
        // Proceed with form submission or further processing
        console.log('Form submitted');
        this.submit();
    }
});
