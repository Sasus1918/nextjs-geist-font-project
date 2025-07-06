document.addEventListener('DOMContentLoaded', function() {
    // Initialize app
    initNavigation();
    initCalendar();
    initTasks();
    initQuickAccess();
    initToggleSwitches();
});

// Navigation functionality
function initNavigation() {
    // Sidebar navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = this.getAttribute('data-section');
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });

            // Close mobile sidebar if open
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    });

    // Mobile navigation toggle
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebar = document.getElementById('sidebar');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Click outside sidebar to close on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            e.target !== mobileNavToggle &&
            !mobileNavToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// Calendar functionality
function initCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthElem = document.getElementById('currentMonth');
    
    if (!calendarGrid || !prevMonthBtn || !nextMonthBtn || !currentMonthElem) return;

    // Current date
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    // Events data from application
    const events = [
        { date: new Date(2025, 5, 15), title: 'Examen de Ciencias', tipo: 'examen' },
        { date: new Date(2025, 5, 18), title: 'Entrega proyecto', tipo: 'tarea' },
        { date: new Date(2025, 5, 20), title: 'Sesión de neurolingüística', tipo: 'clase' }
    ];

    // Generate calendar
    function generateCalendar(month, year) {
        // Clear calendar grid
        calendarGrid.innerHTML = '';
        
        // Update month display
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        currentMonthElem.textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and total days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add weekday headers
        const weekdays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
        weekdays.forEach(weekday => {
            const weekdayElem = document.createElement('div');
            weekdayElem.classList.add('calendar-day', 'weekday');
            weekdayElem.textContent = weekday;
            calendarGrid.appendChild(weekdayElem);
        });
        
        // Add blank spaces for previous month days
        for (let i = 0; i < firstDay; i++) {
            const blankDay = document.createElement('div');
            blankDay.classList.add('calendar-day', 'blank');
            calendarGrid.appendChild(blankDay);
        }
        
        // Add days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElem = document.createElement('div');
            dayElem.classList.add('calendar-day');
            dayElem.textContent = day;
            
            // Check if day is today
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElem.classList.add('today');
            }
            
            // Check if day has events
            const currentDate = new Date(year, month, day);
            const hasEvent = events.some(event => 
                event.date.getDate() === currentDate.getDate() && 
                event.date.getMonth() === currentDate.getMonth() && 
                event.date.getFullYear() === currentDate.getFullYear()
            );
            
            if (hasEvent) {
                dayElem.classList.add('has-event');
                dayElem.addEventListener('click', () => showDayEvents(currentDate));
            }
            
            calendarGrid.appendChild(dayElem);
        }
    }
    
    // Show events for a specific day
    function showDayEvents(date) {
        const eventList = document.getElementById('eventList');
        eventList.innerHTML = '';
        
        const dayEvents = events.filter(event => 
            event.date.getDate() === date.getDate() && 
            event.date.getMonth() === date.getMonth() && 
            event.date.getFullYear() === date.getFullYear()
        );
        
        if (dayEvents.length === 0) {
            const noEventMsg = document.createElement('div');
            noEventMsg.textContent = 'No hay eventos para este día.';
            eventList.appendChild(noEventMsg);
            return;
        }
        
        dayEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.classList.add('event-item', event.tipo);
            
            const eventDate = document.createElement('span');
            eventDate.classList.add('event-date');
            eventDate.textContent = `${date.getDate()} ${['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][date.getMonth()]}`;
            
            const eventTitle = document.createElement('span');
            eventTitle.classList.add('event-title');
            eventTitle.textContent = event.title;
            
            eventItem.appendChild(eventDate);
            eventItem.appendChild(eventTitle);
            eventList.appendChild(eventItem);
        });
    }
    
    // Navigate to previous month
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    // Navigate to next month
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    // Initialize calendar with current month
    generateCalendar(currentMonth, currentYear);
}

// Tasks functionality
function initTasks() {
    // Task completion toggle
    const taskCheckboxes = document.querySelectorAll('.task-checkbox input[type="checkbox"]');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            if (this.checked) {
                taskItem.classList.remove('pending');
                taskItem.classList.add('completed');
            } else {
                taskItem.classList.remove('completed');
                taskItem.classList.add('pending');
            }
        });
    });

    // Task filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    const taskItems = document.querySelectorAll('.task-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Apply filter
            taskItems.forEach(task => {
                if (filter === 'all' || task.classList.contains(filter)) {
                    task.style.display = 'flex';
                } else {
                    task.style.display = 'none';
                }
            });
        });
    });

    // Add Task Button
    const addTaskBtn = document.getElementById('addTaskBtn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', function() {
            alert('Funcionalidad para agregar tareas será implementada próximamente.');
        });
    }
}

// Quick Access Cards
function initQuickAccess() {
    const quickCards = document.querySelectorAll('.quick-card');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    quickCards.forEach(card => {
        card.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update navigation
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === targetSection) {
                    link.classList.add('active');
                }
            });
            
            // Show section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Toggle Switches
function initToggleSwitches() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            // Here we would typically save the toggle state
            // Just a visual feedback for now
            const settingName = this.closest('.setting-label').querySelector('span').textContent;
            if (this.checked) {
                console.log(`${settingName} activado`);
            } else {
                console.log(`${settingName} desactivado`);
            }
        });
    });
}