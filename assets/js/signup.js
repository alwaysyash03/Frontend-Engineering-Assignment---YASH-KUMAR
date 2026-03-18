document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    
    const pwInput = document.getElementById('pw-input');
    const pwToggle = document.getElementById('pw-toggle');
    const pwIcon = document.getElementById('pw-icon');
    
    if (pwToggle && pwInput && pwIcon) {
        pwToggle.addEventListener('click', () => {
            if (pwInput.type === 'password') {
                pwInput.type = 'text';
                pwIcon.setAttribute('data-feather', 'eye-off');
            } else {
                pwInput.type = 'password';
                pwIcon.setAttribute('data-feather', 'eye');
            }
            feather.replace();
        });
    }

    const form = document.getElementById('signup-form');
    const statusMsg = document.getElementById('status-msg');
    const successState = document.getElementById('success-state');
    const emailInput = document.getElementById('email-input');
    const displayEmail = document.getElementById('display-email');
    const footerText = document.getElementById('footer-text');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = document.getElementById('submit-btn');
            if (btn) btn.innerHTML = '<i data-feather="loader" class="w-4 h-4 animate-spin"></i> Creating...';
            feather.replace();
            
            setTimeout(() => {
                form.classList.add('hidden');
                if (footerText) footerText.classList.add('hidden');
                if (successState) {
                    successState.classList.remove('hidden');
                    successState.classList.add('flex');
                }
                
                if (displayEmail && emailInput) displayEmail.innerText = emailInput.value;
            }, 1200);
        });
    }
});
