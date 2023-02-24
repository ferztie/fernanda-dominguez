
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

//Language

function translatePage(language) {
    // Create an object to hold translations
    var translations = {};
    
    // Populate the translations object based on the selected language
    switch (language) {
      case 'es':
        translations.title = 'Título en español';
        translations.subtitle = 'Subtítulo en español';
        // add more translations as needed
        break;
      case 'fr':
        translations.title = 'Titre en français';
        translations.subtitle = 'Sous-titre en français';
        // add more translations as needed
        break;
      default:
        translations.title = 'Title in English';
        translations.subtitle = 'Subtitle in English';
        // add more translations as needed
        break;
    }
    
    // Use jQuery or vanilla JavaScript to replace the text of each element
    // with its translated value from the translations object
    $('h1').text(translations.title);
    $('h2').text(translations.subtitle);
    // add more elements as needed
  }
  

  
