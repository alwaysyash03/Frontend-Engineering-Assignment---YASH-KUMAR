feather.replace();

document.addEventListener('DOMContentLoaded', () => {

    const timer = document.getElementById('freshness-timer');
    let seconds = 0;
    setInterval(() => {
        seconds++;
        if (timer) timer.innerText = seconds + 's';
    }, 1000);

    const deptBtn = document.getElementById('dept-btn');
    const deptDropdown = document.getElementById('dept-dropdown');
    
    if (deptBtn && deptDropdown) {
        deptBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = deptDropdown.classList.contains('hidden');
            if (isHidden) {
                deptDropdown.classList.remove('hidden');
                setTimeout(() => deptDropdown.classList.remove('opacity-0'), 10);
            } else {
                deptDropdown.classList.add('opacity-0');
                setTimeout(() => deptDropdown.classList.add('hidden'), 200);
            }
        });

        document.addEventListener('click', (e) => {
            if (!deptDropdown.contains(e.target)) {
                deptDropdown.classList.add('opacity-0');
                setTimeout(() => deptDropdown.classList.add('hidden'), 200);
            }
        });
    }

    const aiTrigger = document.getElementById('ai-trigger');
    const aiPanel = document.getElementById('ai-panel');
    const aiClose = document.getElementById('ai-close');

    if (aiTrigger && aiPanel && aiClose) {
        aiTrigger.addEventListener('click', () => {
            aiPanel.classList.remove('hidden');
            setTimeout(() => {
                aiPanel.classList.remove('translate-x-full');
            }, 10);
            aiTrigger.classList.add('hidden');
        });

        aiClose.addEventListener('click', () => {
            aiPanel.classList.add('translate-x-full');
            setTimeout(() => {
                aiPanel.classList.add('hidden');
                aiTrigger.classList.remove('hidden');
            }, 300); 
        });
    }

    const gridBody = document.getElementById('data-grid-body');
    const searchInput = document.querySelector('input[placeholder="Search state, district, or ID..."]');
    const categorySelect = document.querySelector('select');
    const rowCountCounter = document.querySelector('.tabular-nums.text-indigo-300'); 

    const locationMap = {
        'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane'],
        'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
        'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
        'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi']
    };
    const states = Object.keys(locationMap);
    
    const mockData = {
        'health': [],
        'agri': []
    };

    function generateMockData(department) {
        let rows = [];
        for (let i = 0; i < 50; i++) {
            const state = states[Math.floor(Math.random() * states.length)];
            const stateDistricts = locationMap[state];
            const district = stateDistricts[Math.floor(Math.random() * stateDistricts.length)];
            rows.push({
                id: `IND-${1000000 + i}`,
                state: state,
                district: district,
                value: Math.floor(Math.random() * 10000000),
                isCompleted: Math.random() > 0.7,
                deleted: false 
            });
        }
        return rows;
    }
    
    mockData['health'] = generateMockData('health');
    mockData['agri'] = generateMockData('agri');

    let currentDepartment = 'health'; 
    
    function renderGrid(department, searchQuery = '', categoryFilter = 'All') {
        if (!gridBody) return;
        currentDepartment = department;

        let htmlRows = '';
        const deptConfig = department === 'agri' 
            ? { category: 'Agriculture', baseColor: 'green' }
            : { category: 'Healthcare', baseColor: 'blue' };

        let activeRows = mockData[department].filter(row => {
            if (row.deleted) return false;
            
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = row.id.toLowerCase().includes(searchLower) || 
                                  row.state.toLowerCase().includes(searchLower) || 
                                  row.district.toLowerCase().includes(searchLower);
            
            const matchesCategory = categoryFilter === 'All' || categoryFilter === deptConfig.category;

            return matchesSearch && matchesCategory;
        });

        const totalValue = activeRows.reduce((sum, row) => sum + row.value, 0);
        const avgBudget = activeRows.length > 0 ? totalValue / activeRows.length : 0;
        const activeCount = activeRows.filter(row => !row.isCompleted).length;
        
        const stateCounts = {};
        activeRows.forEach(row => stateCounts[row.state] = (stateCounts[row.state] || 0) + 1);
        let topState = Object.keys(stateCounts).reduce((a, b) => stateCounts[a] > stateCounts[b] ? a : b, 'None');

        document.getElementById('stat-total-records').innerText = activeRows.length.toLocaleString('en-IN');
        document.getElementById('stat-active-projects').innerText = activeCount.toLocaleString('en-IN');
        document.getElementById('stat-avg-budget').innerText = avgBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 });
        document.getElementById('stat-top-state').innerText = topState;

        activeRows.forEach((row, i) => {
            const valueStr = row.value.toLocaleString('en-IN', { maximumFractionDigits: 0 });

            htmlRows += `
            <div data-row-id="${row.id}" class="static w-full flex border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-150 text-[13px] group h-12 opacity-0 animate-[float-up_0.6s_ease-out_forwards]" style="animation-delay: ${Math.min(i * 10, 200)}ms">
                <div class="w-28 px-4 flex items-center font-mono text-white/30 text-[11px]">${row.id}</div>
                <div class="flex-1 px-4 flex items-center font-medium text-white/90">${row.state}</div>
                <div class="flex-1 px-4 flex items-center text-white/50 text-[12px]">${row.district}</div>
                <div class="w-32 px-4 flex items-center">
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border bg-${deptConfig.baseColor}-500/10 text-${deptConfig.baseColor}-400 border-${deptConfig.baseColor}-500/20">
                    <span class="w-1 h-1 rounded-full bg-${deptConfig.baseColor}-400 shrink-0"></span>${deptConfig.category}
                    </span>
                </div>
                <div class="w-20 px-4 flex items-center justify-end font-mono text-white/40 text-[11px]">2024</div>
                <div class="w-32 px-4 flex items-center justify-end tabular-nums text-white/80 text-[13px] tracking-tight">₹${valueStr}</div>
                <div class="w-28 px-4 flex items-center justify-center">
                    <select class="status-select appearance-none bg-transparent cursor-pointer outline-none border text-center font-medium text-[11px] px-2 py-0.5 rounded flex items-center focus:ring-1 focus:ring-white/20 transition-all ${row.isCompleted ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}">
                        <option value="Active" class="bg-[#0b0b0f] text-green-400" ${!row.isCompleted ? 'selected' : ''}>● Active</option>
                        <option value="Completed" class="bg-[#0b0b0f] text-blue-400" ${row.isCompleted ? 'selected' : ''}>✓ Completed</option>
                    </select>
                </div>
                <div class="w-20 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="text-white/30 hover:text-white p-1.5 rounded-md hover:bg-white/[0.06] transition-colors" title="Edit row"><i data-feather="edit-2" class="w-3.5 h-3.5"></i></button>
                    <button class="delete-row-btn text-white/30 hover:text-red-400 p-1.5 rounded-md hover:bg-red-500/10 transition-colors" title="Delete row"><i data-feather="trash" class="w-3.5 h-3.5 pointer-events-none"></i></button>
                </div>
            </div>`;
        });
        
        if (activeRows.length === 0) {
            htmlRows = `
            <div class="w-full flex items-center justify-center text-white/30 text-xs py-12">
                No matching records found
            </div>`;
        }

        gridBody.innerHTML = htmlRows;
        
        if (rowCountCounter) {
            rowCountCounter.innerText = activeRows.length.toLocaleString('en-US');
        }

        feather.replace(); 
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderGrid(currentDepartment, e.target.value, categorySelect ? categorySelect.value : 'All');
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            renderGrid(currentDepartment, searchInput ? searchInput.value : '', e.target.value);
        });
    }

    renderGrid('health');

    if (gridBody) {
        gridBody.addEventListener('change', (e) => {
            if (e.target.classList.contains('status-select')) {
                const val = e.target.value;
                const rowId = e.target.closest('[data-row-id]').getAttribute('data-row-id');
                // Reflect back to mock store
                const rowEntry = mockData[currentDepartment].find(r => r.id === rowId);
                if (rowEntry) {
                    rowEntry.isCompleted = (val === 'Completed');
                }

                if (val === 'Completed') {
                    e.target.className = 'status-select appearance-none bg-transparent cursor-pointer outline-none border text-center font-medium text-[11px] px-2 py-0.5 rounded flex items-center focus:ring-1 focus:ring-white/20 transition-all bg-blue-500/10 text-blue-400 border-blue-500/20';
                } else {
                    e.target.className = 'status-select appearance-none bg-transparent cursor-pointer outline-none border text-center font-medium text-[11px] px-2 py-0.5 rounded flex items-center focus:ring-1 focus:ring-white/20 transition-all bg-green-500/10 text-green-400 border-green-500/20';
                }
            }
        });

        gridBody.addEventListener('click', (e) => {
            const btn = e.target.closest('.delete-row-btn');
            if (btn) {
                const rowEl = btn.closest('[data-row-id]');
                const rowId = rowEl.getAttribute('data-row-id');
                const rowEntry = mockData[currentDepartment].find(r => r.id === rowId);
                if (rowEntry) rowEntry.deleted = true;
                
                rowEl.style.transition = 'all 0.3s ease-out';
                rowEl.style.opacity = '0';
                rowEl.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    renderGrid(currentDepartment, searchInput ? searchInput.value : '', categorySelect ? categorySelect.value : 'All');
                }, 300);
            }
        });
    }

    const deptBtnToggle = document.getElementById('dept-btn');
    const globalDeptName = document.getElementById('global-dept-name');
    const deptBtnName = document.getElementById('dept-btn-name');
    const deptBtnIcon = document.getElementById('dept-btn-icon');
    
    const deptHealthBtn = document.getElementById('dept-health');
    const deptHealthCheck = document.getElementById('dept-health-check');
    const deptAgriBtn = document.getElementById('dept-agri');
    const deptAgriCheck = document.getElementById('dept-agri-check');

    if (deptHealthBtn && deptAgriBtn) {
        deptHealthBtn.addEventListener('click', () => {
            deptHealthBtn.classList.replace('hover:bg-white/[0.03]', 'bg-white/[0.06]');
            deptHealthBtn.classList.replace('text-white/60', 'text-white');
            deptHealthCheck.classList.remove('hidden');

            deptAgriBtn.classList.replace('bg-white/[0.06]', 'hover:bg-white/[0.03]');
            deptAgriBtn.classList.replace('text-white', 'text-white/60');
            deptAgriCheck.classList.add('hidden');

            globalDeptName.innerText = 'Min. of Health';
            deptBtnName.innerText = 'Min. of Health';
            deptBtnIcon.innerHTML = '<i data-feather="heart" class="w-4 h-4"></i>';
            deptBtnToggle.className = 'flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-300 hover:bg-white/[0.04] bg-indigo-500/10 border-indigo-500/25 text-indigo-400';

            feather.replace();
            const categoryOption = currentDepartment === 'agri' ? 'Agriculture' : 'Healthcare';
            
            if (categorySelect) {
                categorySelect.innerHTML = `<option class="bg-[#0b0b0f]" value="${categoryOption}">${categoryOption}</option>\n<option class="bg-[#0b0b0f]" value="All">All Categories</option>`;
                categorySelect.value = categoryOption;
            }

            renderGrid('health', searchInput ? searchInput.value : '', categorySelect ? categorySelect.value : 'All');
            
            const deptDropdown = document.getElementById('dept-dropdown');
            if (deptDropdown) {
                deptDropdown.classList.add('opacity-0');
                setTimeout(() => deptDropdown.classList.add('hidden'), 200);
            }
        });

        deptAgriBtn.addEventListener('click', () => {
            deptAgriBtn.classList.replace('hover:bg-white/[0.03]', 'bg-white/[0.06]');
            deptAgriBtn.classList.replace('text-white/60', 'text-white');
            deptAgriCheck.classList.remove('hidden');

            deptHealthBtn.classList.replace('bg-white/[0.06]', 'hover:bg-white/[0.03]');
            deptHealthBtn.classList.replace('text-white', 'text-white/60');
            deptHealthCheck.classList.add('hidden');

            globalDeptName.innerText = 'Min. of Agriculture';
            deptBtnName.innerText = 'Min. of Agriculture';
            deptBtnIcon.innerHTML = '<i data-feather="wind" class="w-4 h-4"></i>';
            deptBtnToggle.className = 'flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-300 hover:bg-white/[0.04] bg-green-500/10 border-green-500/25 text-green-400';

            feather.replace();
            const categoryOption = currentDepartment === 'agri' ? 'Agriculture' : 'Healthcare';
            
            if (categorySelect) {
                categorySelect.innerHTML = `<option class="bg-[#0b0b0f]" value="${categoryOption}">${categoryOption}</option>\n<option class="bg-[#0b0b0f]" value="All">All Categories</option>`;
                categorySelect.value = categoryOption;
            }

            renderGrid('agri', searchInput ? searchInput.value : '', categorySelect ? categorySelect.value : 'All');

            const deptDropdown = document.getElementById('dept-dropdown');
            if (deptDropdown) {
                deptDropdown.classList.add('opacity-0');
                setTimeout(() => deptDropdown.classList.add('hidden'), 200);
            }
        });
    }

    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');

    if (chatForm) {
        const quickPrompts = document.querySelectorAll('.quick-prompt');
        quickPrompts.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                chatInput.value = btn.innerText;
                chatForm.dispatchEvent(new Event('submit'));
            });
        });

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if(!text) return;
            
            const userHtml = `
            <div class="flex gap-2.5 flex-row-reverse" style="animation: slide-in-right 0.3s ease forwards">
                <div class="shrink-0 w-7 h-7 rounded-[10px] flex items-center justify-center border shadow-sm bg-indigo-500/10 border-indigo-500/20 text-indigo-400">
                    <i data-feather="user" class="w-3.5 h-3.5"></i>
                </div>
                <div class="max-w-[85%] rounded-[18px] px-4 py-2.5 text-sm leading-relaxed bg-[#1e1e2e]/40 border border-white/[0.06] text-white/90 rounded-tr-sm">
                    ${text}
                </div>
            </div>`;
            chatBody.insertAdjacentHTML('beforeend', userHtml);
            chatInput.value = '';
            feather.replace();
            chatBody.scrollTop = chatBody.scrollHeight;

            setTimeout(() => {
                const aiHtml = `
                <div class="flex gap-2.5 flex-row" style="animation: slide-in-right 0.3s ease forwards">
                    <div class="shrink-0 w-7 h-7 rounded-[10px] flex items-center justify-center border shadow-sm bg-gradient-to-br from-violet-500/20 to-indigo-500/5 border-violet-500/20 text-violet-400">
                        <i data-feather="cpu" class="w-3.5 h-3.5"></i>
                    </div>
                    <div class="max-w-[85%] rounded-[18px] px-4 py-2.5 text-sm leading-relaxed bg-[#0b0b0f] border border-white/[0.06] text-white/80 rounded-tl-sm shadow-md text-white/70">
                        Here is a simulated response. Connected directly to the Bharat Insight data engine for rapid analytics.
                    </div>
                </div>`;
                chatBody.insertAdjacentHTML('beforeend', aiHtml);
                feather.replace();
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 1000);
        });
    }
});
