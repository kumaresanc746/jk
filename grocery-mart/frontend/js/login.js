document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            skipAuthRedirect: true
        });
        
        setToken(data.token);
        setUser(data.user);
        
        messageDiv.innerHTML = '<div class="message message-success">Login successful! Redirecting...</div>';
        
        setTimeout(() => {
            if (data.user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
    } catch (error) {
        const msg = (error && error.message && error.message.toLowerCase().includes('invalid credentials'))
            ? 'Invalid username/pass'
            : (error.message || 'Something went wrong');
        messageDiv.innerHTML = `<div class="message message-error">${msg}</div>`;
    }
});

