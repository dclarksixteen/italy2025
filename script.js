// Travel Website JavaScript

// Tab navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all tab navigation items
    const tabItems = document.querySelectorAll('.nav-tabs li');
    
    // Add click event listeners to each tab
    tabItems.forEach(tab => {
        tab.addEventListener('click', function() {
            // Get the data-tab attribute to identify which tab was clicked
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab content sections
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected tab content
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Scroll handling for sticky navigation
    const nav = document.querySelector('nav');
    const navTop = nav.offsetTop;

    function fixNav() {
        if (window.scrollY >= navTop) {
            document.body.style.paddingTop = nav.offsetHeight + 'px';
            document.body.classList.add('fixed-nav');
        } else {
            document.body.style.paddingTop = 0;
            document.body.classList.remove('fixed-nav');
        }
    }

    window.addEventListener('scroll', fixNav);

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle if needed for smaller screens
    function handleResponsiveNav() {
        if (window.innerWidth <= 768) {
            // Add scroll behavior to nav tabs
            const navTabsContainer = document.querySelector('.nav-tabs');
            navTabsContainer.style.overflowX = 'auto';
            navTabsContainer.style.webkitOverflowScrolling = 'touch';
            navTabsContainer.style.scrollBehavior = 'smooth';
        }
    }

    // Call once on load
    handleResponsiveNav();
    
    // Call again if window is resized
    window.addEventListener('resize', handleResponsiveNav);

    // Add current year to footer
    const yearSpan = document.querySelector('footer .container p');
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = yearSpan.textContent.replace('2025', currentYear);
});

// Helper function to format dates nicely if needed
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to add days to the itinerary dynamically
// Uncomment and use if you want to add days programmatically
/*
function addItineraryDay(day, location, activities) {
    const itineraryContainer = document.querySelector('.itinerary-days');
    
    // Create day card
    const dayCard = document.createElement('div');
    dayCard.className = 'day-card';
    
    // Create day header
    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';
    dayHeader.innerHTML = `
        <h3>Day ${day.day} - ${day.date}</h3>
        <span class="location">${location}</span>
    `;
    
    // Create activities list
    const activitiesList = document.createElement('ul');
    activitiesList.className = 'day-activities';
    
    // Add each activity
    activities.forEach(activity => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="time">${activity.time}</span> ${activity.description}`;
        activitiesList.appendChild(li);
    });
    
    // Assemble the day card
    dayCard.appendChild(dayHeader);
    dayCard.appendChild(activitiesList);
    
    // Add to the itinerary container
    itineraryContainer.appendChild(dayCard);
}
*/

// Example of how to create a notification for important updates
// Uncomment and use if needed
/*
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show the notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
*/

// You can call showNotification('Your message here') to show a notification

// Add weather icons based on condition text
// This function is already being used in the HTML with inline icons
function getWeatherIcon(condition) {
    condition = condition.toLowerCase();
    if (condition.includes('sun')) return 'fa-sun';
    if (condition.includes('cloud') && condition.includes('sun')) return 'fa-cloud-sun';
    if (condition.includes('cloud')) return 'fa-cloud';
    if (condition.includes('rain')) return 'fa-cloud-rain';
    if (condition.includes('snow')) return 'fa-snowflake';
    if (condition.includes('storm') || condition.includes('thunder')) return 'fa-bolt';
    return 'fa-sun'; // Default
}
