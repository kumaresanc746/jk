document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.user.role !== 'admin') {
            messageDiv.innerHTML = '<div class="message message-error">Access denied. Admin account required.</div>';
            return;
        }
        
        setToken(data.token);
        setUser(data.user);
        
        messageDiv.innerHTML = '<div class="message message-success">Admin login successful! Redirecting...</div>';
        
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } catch (error) {
        messageDiv.innerHTML = `<div class="message message-error">${error.message}</div>`;
    }
});

