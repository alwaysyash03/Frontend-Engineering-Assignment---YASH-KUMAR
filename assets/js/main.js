feather.replace();

document.addEventListener('DOMContentLoaded', () => {
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 20) {
                navbar.classList.add('glass-panel', 'border-b', 'border-light', 'shadow-sm');
                navbar.classList.remove('bg-transparent', 'border-transparent');
            } else {
                navbar.classList.remove('glass-panel', 'border-b', 'border-light', 'shadow-sm');
                navbar.classList.add('bg-transparent', 'border-transparent');
            }
        }
    });

    const counters = document.querySelectorAll('.tabular-nums');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix');
            const duration = 1800;
            const start = performance.now();
            let hasAnimated = false; 

            const rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight && !counter.classList.contains('animated')) {
                counter.classList.add('animated');
                
                const tick = (now) => {
                    const t = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - t, 3); 
                    const currentCount = Math.floor(eased * target);
                    
                    const formatted = currentCount >= 1000 
                        ? (currentCount / 1000).toFixed(0) + 'K' 
                        : currentCount;

                    counter.innerText = formatted + suffix;

                    if (t < 1) requestAnimationFrame(tick);
                    else counter.innerText = (target >= 1000 ? (target / 1000).toFixed(0) + 'K' : target) + suffix;
                };
                
                setTimeout(() => requestAnimationFrame(tick), 400);
            }
        });
    };

    window.addEventListener('scroll', animateCounters);
    animateCounters(); 

    const terminalLines = [
        { text: '> Connecting to data.gov.in...', color: 'text-white/50', delay: 0 },
        { text: '✓ Loaded 100,000 records', color: 'text-green-400', delay: 600 },
        { text: '> Running Gemini inference on active filters...', color: 'text-white/50', delay: 1200 },
        { text: '✦ AI  Healthcare spending ↑12% in rural districts', color: 'text-indigo-300', delay: 2000 },
    ];
    
    const terminalContent = document.getElementById('terminal-content');
    if (terminalContent) {
        let visibleCount = 0;
        
        terminalLines.forEach((line, index) => {
            setTimeout(() => {
                const div = document.createElement('div');
                div.className = `${line.color} leading-relaxed`;
                div.innerText = line.text;
                
                const cursor = terminalContent.querySelector('.cursor');
                if (cursor) terminalContent.removeChild(cursor);

                terminalContent.appendChild(div);

                if (index < terminalLines.length - 1) {
                    const span = document.createElement('span');
                    span.className = "inline-block w-1.5 h-3.5 bg-indigo-400 align-bottom animate-pulse cursor";
                    terminalContent.appendChild(span);
                }
            }, line.delay + 800);
        });
    }
});
