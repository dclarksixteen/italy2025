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

// Helper function to convert C to F
function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
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

// Weather API Integration with Enhanced Error Handling

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize weather if we're on the weather tab or when it becomes active
    const weatherTab = document.querySelector('[data-tab="weather"]');
    const weatherSection = document.getElementById('weather');
    
    if (weatherTab && weatherSection) {
        // Initialize weather when tab is clicked
        weatherTab.addEventListener('click', function() {
            initWeather();
        });
        
        // Also initialize if weather tab is already active on page load
        if (weatherTab.classList.contains('active')) {
            initWeather();
        }
    }
});

function initWeather() {
    const locationSelect = document.getElementById('location-select');
    const refreshButton = document.getElementById('refresh-weather');
    const weatherResults = document.getElementById('weather-results');
    const forecastTable = document.getElementById('forecast-data');
    
    // Your API key - make sure this matches exactly with your OpenWeatherMap account
    const apiKey = 'f03a797889ddb6070ca329c3032e0904';
    
    // Coordinates for each location
    const locations = {
        naples: { lat: 40.8518, lon: 14.2681, name: 'Naples' },
        amalfi: { lat: 40.6341, lon: 14.6023, name: 'Amalfi Coast' },
        capri: { lat: 40.5532, lon: 14.2222, name: 'Capri' },
        rome: { lat: 41.9028, lon: 12.4964, name: 'Rome' }
    };
    
    // Check if weather data is already in session storage and not expired
    const cachedData = sessionStorage.getItem('weatherData');
    const cachedTimestamp = sessionStorage.getItem('weatherTimestamp');
    const currentTime = new Date().getTime();
    const cacheExpiry = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    // If we have cached data and it's still fresh, use it
    if (cachedData && cachedTimestamp && (currentTime - cachedTimestamp < cacheExpiry)) {
        displayWeatherData(JSON.parse(cachedData));
    } else {
        // Otherwise fetch new data
        fetchWeatherData(locations[locationSelect.value]);
    }
    
    // Event listener for location change
    locationSelect.addEventListener('change', function() {
        fetchWeatherData(locations[this.value]);
    });
    
    // Event listener for refresh button
    refreshButton.addEventListener('click', function() {
        fetchWeatherData(locations[locationSelect.value]);
    });
    
    // Function to fetch weather data from API
    function fetchWeatherData(location) {
        // Show loading state
        refreshButton.classList.add('loading');
        weatherResults.innerHTML = '<p class="weather-loading">Fetching current weather data...</p>';
        forecastTable.innerHTML = '<tr class="loading-row"><td colspan="5">Loading forecast data...</td></tr>';
        
        // Set up debug information
        let debugInfo = {
            apiKey: apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4),
            endpoint: 'onecall',
            location: `${location.name} (${location.lat}, ${location.lon})`,
            timestamp: new Date().toISOString()
        };
        
        // Try using the Current Weather API endpoint instead of OneCall which might be premium
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${apiKey}`;
        
        console.log('Weather API Debug - Request info:', debugInfo);
        console.log('Weather API Debug - Making request to:', apiUrl);
        
        // Call the OpenWeatherMap API with the location coordinates
        fetch(apiUrl)
            .then(response => {
                console.log('Weather API Debug - Response status:', response.status);
                
                if (!response.ok) {
                    // Try alternative endpoint if main one fails
                    if (response.status === 401) {
                        throw new Error(`Authentication failed (Status 401). Your API key may be invalid or not yet activated.`);
                    }
                    throw new Error(`Weather API returned status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Weather API Debug - Received data:', data);
                
                // Format the data to match our display function
                const formattedData = {
                    location_name: location.name,
                    current: {
                        dt: data.dt,
                        temp: data.main.temp,
                        humidity: data.main.humidity,
                        wind_speed: data.wind.speed,
                        clouds: data.clouds.all,
                        uvi: 0, // Not available in this endpoint
                        weather: data.weather
                    },
                    // For demo purposes, generate 7 days of forecast based on current weather
                    daily: generateSimpleForecast(data, 7)
                };
                
                // Cache the data
                sessionStorage.setItem('weatherData', JSON.stringify(formattedData));
                sessionStorage.setItem('weatherTimestamp', currentTime);
                
                // Display the data
                displayWeatherData(formattedData);
                
                // Show a notice that we're using simulated forecast
                const noticeElement = document.createElement('div');
                noticeElement.className = 'weather-notice';
                noticeElement.innerHTML = `
                    <p><i class="fas fa-info-circle"></i> Using free API endpoint with simulated forecast data. 
                    Consider upgrading to One Call API for actual forecasts.</p>
                `;
                weatherResults.appendChild(noticeElement);
                
                // Remove loading state
                refreshButton.classList.remove('loading');
            })
            .catch(error => {
                console.error('Weather API Debug - Error:', error);
                
                // Display detailed error message
                weatherResults.innerHTML = `
                    <div class="weather-error">
                        <h4><i class="fas fa-exclamation-circle"></i> Unable to fetch weather data</h4>
                        <p class="weather-error-details">${error.message}</p>
                        <div class="weather-debug-info">
                            <h5>Debug Information:</h5>
                            <ul>
                                <li><strong>API Key:</strong> ${debugInfo.apiKey}</li>
                                <li><strong>Endpoint:</strong> ${debugInfo.endpoint}</li>
                                <li><strong>Location:</strong> ${debugInfo.location}</li>
                                <li><strong>Time:</strong> ${debugInfo.timestamp}</li>
                                <li><strong>Browser:</strong> ${navigator.userAgent}</li>
                            </ul>
                            <p class="debug-help">If the issue persists, try these troubleshooting steps:</p>
                            <ol>
                                <li>Verify the API key is correct and active in your OpenWeatherMap account</li>
                                <li>Check if your free API key has access to the endpoints being used</li>
                                <li>New API keys may take up to 2 hours to activate</li>
                                <li>Check if you've reached your API call limits</li>
                                <li>Try using https:// instead of http:// in the API call (or vice versa)</li>
                            </ol>
                        </div>
                    </div>
                `;
                
                forecastTable.innerHTML = '<tr class="error-row"><td colspan="5">Failed to load forecast data</td></tr>';
                refreshButton.classList.remove('loading');
                
                // Show fallback weather data after error
                showFallbackWeatherData(location);
            });
    }
    
    // Function to generate a simple forecast based on current weather
    function generateSimpleForecast(currentData, days) {
        const forecast = [];
        const baseTemp = currentData.main.temp;
        const baseWeather = currentData.weather[0];
        
        // Generate forecast for each day
        for (let i = 0; i < days; i++) {
            // Random temperature variation
            const tempVariation = Math.random() * 4 - 2; // -2 to +2 degrees
            const dayTemp = baseTemp + tempVariation;
            
            // Weather variation
            const weatherTypes = [
                baseWeather,
                { main: 'Clear', description: 'clear sky' },
                { main: 'Clouds', description: 'few clouds' },
                { main: 'Clouds', description: 'scattered clouds' }
            ];
            const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            
            forecast.push({
                dt: currentData.dt + (i + 1) * 86400, // Next day in seconds
                temp: {
                    min: dayTemp - 3,
                    max: dayTemp + 3
                },
                humidity: currentData.main.humidity + Math.floor(Math.random() * 10 - 5),
                wind_speed: currentData.wind.speed + (Math.random() - 0.5),
                weather: [randomWeather],
                pop: Math.random() * 0.5 // 0-50% chance of precipitation
            });
        }
        
        return forecast;
    }
    
    // Function to show fallback weather data
    function showFallbackWeatherData(location) {
        // Add a fallback notice
        const fallbackNotice = document.createElement('div');
        fallbackNotice.className = 'weather-fallback-notice';
        fallbackNotice.innerHTML = `
            <h4><i class="fas fa-cloud"></i> Showing Typical May Weather for ${location.name}</h4>
            <p>This is historical average data and not real-time weather.</p>
        `;
        weatherResults.appendChild(fallbackNotice);
        
        // Create a fallback card with typical May weather
        const fallbackCard = document.createElement('div');
        fallbackCard.className = 'weather-card';
        fallbackCard.innerHTML = `
            <div class="weather-icon"><i class="fas fa-sun"></i></div>
            <div class="weather-date">Typical May Weather</div>
            <div class="weather-location">${location.name}</div>
            <div class="weather-condition">Mostly sunny</div>
            <div class="weather-temp">${celsiusToFahrenheit(22)}°F</div>
            <div class="weather-details">
                <div class="weather-detail"><i class="fas fa-tint"></i> Avg. Humidity: 65%</div>
                <div class="weather-detail"><i class="fas fa-wind"></i> Avg. Wind: 12 km/h</div>
                <div class="weather-detail"><i class="fas fa-cloud-rain"></i> Avg. Rainfall: 4 days/month</div>
            </div>
        `;
        weatherResults.appendChild(fallbackCard);
        
        // Create fallback table rows
        const tripDates = [
            { date: "May 18", location: "Naples/Amalfi" },
            { date: "May 19", location: "Amalfi Coast" },
            { date: "May 20", location: "Capri" },
            { date: "May 21", location: "Naples/Rome" },
            { date: "May 22", location: "Rome" },
            { date: "May 23", location: "Rome" },
            { date: "May 24", location: "Rome" }
        ];
        
        // Typical May conditions for these locations
        const typicalConditions = {
            "Naples/Amalfi": { icon: "fa-sun", condition: "Sunny", high: 22, low: 15, rain: 20 },
            "Amalfi Coast": { icon: "fa-sun", condition: "Sunny", high: 23, low: 16, rain: 15 },
            "Capri": { icon: "fa-cloud-sun", condition: "Partly Cloudy", high: 21, low: 15, rain: 25 },
            "Naples/Rome": { icon: "fa-cloud-sun", condition: "Partly Cloudy", high: 23, low: 14, rain: 20 },
            "Rome": { icon: "fa-sun", condition: "Sunny", high: 24, low: 15, rain: 15 }
        };
        
        tripDates.forEach(trip => {
            const condition = typicalConditions[trip.location];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${trip.date}</td>
                <td>${trip.location}</td>
                <td><i class="fas ${condition.icon}"></i> ${condition.condition}</td>
                <td>${celsiusToFahrenheit(condition.high)}°F / ${celsiusToFahrenheit(condition.low)}°F</td>
                <td>${condition.rain}%</td>
            `;
            forecastTable.appendChild(row);
        });
    }
    
    // Function to display weather data
    function displayWeatherData(data) {
        // Clear previous results
        weatherResults.innerHTML = '';
        forecastTable.innerHTML = '';
        
        // Current weather display
        const currentWeather = data.current;
        const currentCard = document.createElement('div');
        currentCard.className = 'weather-card';
        
        // Format the current time
        const currentDate = new Date(currentWeather.dt * 1000);
        const formattedCurrentDate = currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        currentCard.innerHTML = `
            <div class="weather-icon"><i class="${getWeatherIconClass(currentWeather.weather[0].main)}"></i></div>
            <div class="weather-date">Current Weather (${formattedCurrentDate})</div>
            <div class="weather-location">${data.location_name}</div>
            <div class="weather-condition">${currentWeather.weather[0].description}</div>
            <div class="weather-temp">${celsiusToFahrenheit(currentWeather.temp)}°F</div>
            <div class="weather-details">
                <div class="weather-detail"><i class="fas fa-tint"></i> Humidity: ${currentWeather.humidity}%</div>
                <div class="weather-detail"><i class="fas fa-wind"></i> Wind: ${Math.round(currentWeather.wind_speed * 3.6)} km/h</div>
                <div class="weather-detail"><i class="fas fa-cloud"></i> Cloud cover: ${currentWeather.clouds || 0}%</div>
                <div class="weather-detail"><i class="fas fa-sun"></i> UV Index: ${currentWeather.uvi || 'N/A'}</div>
            </div>
        `;
        weatherResults.appendChild(currentCard);
        
        // Trip dates for the forecast
        const tripDates = [
            { date: "May 18", location: "Naples/Amalfi" },
            { date: "May 19", location: "Amalfi Coast" },
            { date: "May 20", location: "Capri" },
            { date: "May 21", location: "Naples/Rome" },
            { date: "May 22", location: "Rome" },
            { date: "May 23", location: "Rome" },
            { date: "May 24", location: "Rome" }
        ];
        
        // Create rows for each day of the trip
        data.daily.slice(0, 7).forEach((day, index) => {
            const tripInfo = tripDates[index];
            const row = document.createElement('tr');
            
            // Format date
            const date = new Date(day.dt * 1000);
            const formattedDate = date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
            
                row.innerHTML = `
                <td>${tripInfo.date}</td>
                <td>${tripInfo.location}</td>
                <td><i class="${getWeatherIconClass(day.weather[0].main)}"></i> ${day.weather[0].description}</td>
                <td>${celsiusToFahrenheit(day.temp.max)}°F / ${celsiusToFahrenheit(day.temp.min)}°F</td>
                <td>${day.pop ? Math.round(day.pop * 100) : 0}%</td>
            `;
            
            forecastTable.appendChild(row);
        });
    }
    
    // Function to get weather icon class based on condition
    function getWeatherIconClass(condition) {
        condition = condition.toLowerCase();
        if (condition.includes('clear')) return 'fas fa-sun';
        if (condition.includes('cloud') && (condition.includes('sun') || condition.includes('clear'))) return 'fas fa-cloud-sun';
        if (condition.includes('cloud')) return 'fas fa-cloud';
        if (condition.includes('rain') || condition.includes('drizzle')) return 'fas fa-cloud-rain';
        if (condition.includes('storm') || condition.includes('thunder')) return 'fas fa-bolt';
        if (condition.includes('snow')) return 'fas fa-snowflake';
        if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) return 'fas fa-smog';
        return 'fas fa-sun'; // Default
    }
}

// Add styles for the debug information and fallback notice
document.addEventListener('DOMContentLoaded', function() {
    // Create a style element
    const style = document.createElement('style');
    style.textContent = `
        .weather-error {
            background-color: #ffebee;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .weather-error h4 {
            color: #d32f2f;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .weather-error-details {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 15px;
        }
        
        .weather-debug-info {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
            font-size: 0.85em;
        }
        
        .weather-debug-info h5 {
            margin-bottom: 10px;
            color: #333;
        }
        
        .weather-debug-info ul {
            list-style: none;
            padding-left: 0;
            margin-bottom: 15px;
        }
        
        .weather-debug-info li {
            margin-bottom: 5px;
        }
        
        .debug-help {
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .error-row td {
            text-align: center;
            padding: 20px;
            color: #d9534f;
            font-style: italic;
        }
        
        .weather-fallback-notice {
            background-color: #e8f5e9;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .weather-fallback-notice h4 {
            color: var(--primary-color);
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .weather-fallback-notice p {
            color: #666;
            font-size: 0.9em;
        }
        
        .weather-notice {
            background-color: #fff9c4;
            border-radius: 10px;
            padding: 12px;
            margin-top: 15px;
            text-align: center;
            font-size: 0.9em;
        }
        
        .weather-notice p {
            color: #5d4037;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .weather-location {
            font-weight: bold;
            font-size: 1.1rem;
            margin-bottom: 5px;
            color: var(--secondary-color);
        }
    `;
    
    // Append to the head
    document.head.appendChild(style);
});
