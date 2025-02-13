function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
}

// Fetch and display categories dynamically
async function fdata() {
    try {
        let apiData = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        let { categories } = await apiData.json();
        
        let cont = document.getElementById('category');
        cont.innerHTML = ""; // Clear previous content

        categories.forEach(item => {
            let div = document.createElement("div");
            div.classList.add("item");

            div.innerHTML = `
                <img src="${item.strCategoryThumb}" alt="${item.strCategory}">
                <div class="label">${item.strCategory}</div>
            `;

            // Clicking a category fetches meals & hides categories
            div.addEventListener("click", () => {
                fetchMealsByCategory(item.strCategory);
                cont.style.display = "none"; // Hide categories
                document.getElementById("backButton").style.display = "block"; // Show Back Button
            });

            cont.appendChild(div);
        });

        // Add event listeners to sidebar categories
        addSidebarListeners();
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Fetch meals by category
async function fetchMealsByCategory(categoryName) {
    try {
        let apiData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
        let { meals } = await apiData.json();

        let mealContainer = document.getElementById('meals');
        mealContainer.innerHTML = ""; // Clear previous meals

        meals.forEach(meal => {
            let mealDiv = document.createElement("div");
            mealDiv.classList.add("meal-item");

            mealDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="label">${meal.strMeal}</div>
            `;

            mealContainer.appendChild(mealDiv);
        });

        // Hide sidebar after selection
        document.getElementById("sidebar").classList.remove("active");

    } catch (error) {
        console.error("Error fetching meals:", error);
    }
}

// Add event listeners to sidebar categories
function addSidebarListeners() {
    let sidebarItems = document.querySelectorAll(".sidebar ul li");

    sidebarItems.forEach(item => {
        item.addEventListener("click", function () {
            let category = this.innerText.trim(); // Get category name
            fetchMealsByCategory(category);
            document.getElementById("category").style.display = "none"; // Hide main categories
            document.getElementById("backButton").style.display = "block"; // Show Back Button
        });
    });
}

// Show categories again when Back button is clicked
function showCategories() {
    document.getElementById("category").style.display = "flex"; // Show categories
    document.getElementById("meals").innerHTML = ""; // Clear meals section
    document.getElementById("backButton").style.display = "none"; // Hide Back Button
}

fdata(); // Call the function on page load
