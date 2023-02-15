const toggle = document.getElementById('theme-toggle');

// Get the current theme from Local Storage
const currentTheme = localStorage.getItem('theme');

// If the current theme is 'dark', set the toggle to checked and add the dark class to the HTML element
if (currentTheme === 'dark') {
    toggle.checked = true;
    document.documentElement.classList.add('dark');
}

// Add an event listener to the toggle to listen for changes
toggle.addEventListener('change', function(event) {
    if (event.target.checked) {
        // If the toggle is checked, add the 'dark' class to the HTML element
        document.documentElement.classList.add('dark');
        // Save the theme to Local Storage
        localStorage.setItem('theme', 'dark');
    } else {
        // If the toggle is not checked, remove the 'dark' class from the HTML element
        document.documentElement.classList.remove('dark');
        // Save the theme to Local Storage
        localStorage.setItem('theme', 'light');
    }
});
