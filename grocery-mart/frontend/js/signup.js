document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    try {
        const data = await apiCall('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, phone, password })
        });
        
        setToken(data.token);
        setUser(data.user);
        
        messageDiv.innerHTML = '<div class="message message-success">Account created successfully! Redirecting...</div>';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        messageDiv.innerHTML = `<div class="message message-error">${error.message}</div>`;
    }
});

