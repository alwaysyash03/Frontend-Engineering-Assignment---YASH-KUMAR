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

    const form = document.getElementById('login-form');
    const statusMsg = document.getElementById('status-msg');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            statusMsg.classList.remove('hidden');
            statusMsg.className = 'text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 leading-relaxed mt-4';
            statusMsg.innerHTML = '<span class="flex items-center gap-2"><i data-feather="loader" class="w-3 h-3 animate-spin"></i> Authenticating statically...</span>';
            feather.replace();
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }
});
