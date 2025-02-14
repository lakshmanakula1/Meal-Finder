// Toggle Sidebar Menu
function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
}

// Fetch and Display Categories
async function fetchCategories() {
    let apiUrl = "https://www.themealdb.com/api/json/v1/1/categories.php";
    let apiData = await fetch(apiUrl);
    let { categories } = await apiData.json();

    let categoryContainer = document.getElementById('category');
    categoryContainer.innerHTML = ""; // Clear previous data

    categories.forEach(item => {
        let categoryDiv = document.createElement("div");
        categoryDiv.classList.add("item");

        categoryDiv.innerHTML = `
            <img src="${item.strCategoryThumb}" alt="${item.strCategory}">
            <div class="label">${item.strCategory}</div>
        `;

        // Click Event to Fetch Meals in that Category
        categoryDiv.addEventListener("click", () => {
            fetchMealsByCategory(item.strCategory);
            document.getElementById("category").style.display = "none"; // Hide categories
        });

        categoryContainer.appendChild(categoryDiv);
    });
}

// Fetch Meals by Category
async function fetchMealsByCategory(categoryName) {
    let apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`;
    let apiData = await fetch(apiUrl);
    let { meals } = await apiData.json();

    let mealContainer = document.getElementById('meals');
    mealContainer.innerHTML = ""; // Clear previous data

    meals.forEach(meal => {
        let mealDiv = document.createElement("div");
        mealDiv.classList.add("meal-item");

        mealDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="label">${meal.strMeal}</div>
        `;

        // Click Event to Show Meal Details
        mealDiv.addEventListener("click", () => {
            fetchMealDetails(meal.idMeal);
        });

        mealContainer.appendChild(mealDiv);
    });

    document.getElementById("sidebar").classList.remove("active"); // Close sidebar
}

// Fetch Meal Details by ID
async function fetchMealDetails(mealID) {
    let apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`;
    let apiData = await fetch(apiUrl);
    let { meals } = await apiData.json();
    let meal = meals[0];

    let mealContainer = document.getElementById('meals');
    mealContainer.innerHTML = ""; // Clear previous data

    // Get Ingredients List
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            ingredients += `<li>${measure} ${ingredient}</li>`;
        }
    }

    // Display Meal Details
    let mealDetails = `
        <div class="meal-details">
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>Ingredients</h3>
            <ul>${ingredients}</ul>
            <h3>Instructions</h3>
            <p>${meal.strInstructions}</p>
            <button onclick="fetchCategories()">Back to Categories</button>
        </div>
    `;

    mealContainer.innerHTML = mealDetails;
}

// Search Meals by Name
async function searchMeal() {
    let searchQuery = document.getElementById("searchbar").value.trim();
    if (searchQuery === "") return; // Prevent empty search

    let apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`;
    let apiData = await fetch(apiUrl);
    let { meals } = await apiData.json();

    let mealContainer = document.getElementById('meals');
    mealContainer.innerHTML = "";

    if (meals) {
        meals.forEach(meal => {
            let mealDiv = document.createElement("div");
            mealDiv.classList.add("meal-item");

            mealDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="label">${meal.strMeal}</div>
            `;

            // Click Event to Show Meal Details
            mealDiv.addEventListener("click", () => {
                fetchMealDetails(meal.idMeal);
            });

            mealContainer.appendChild(mealDiv);
        });
    } else {
        mealContainer.innerHTML = `<p style="text-align:center; font-size:20px; color:red;">No meals found!</p>`;
    }
}

// Event Listener for Search Icon Click
document.getElementById("searchicon").addEventListener("click", searchMeal);

// Event Listener for Enter Key in Search Bar
document.getElementById("searchbar").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchMeal();
    }
});

// Load Categories on Page Load
document.addEventListener("DOMContentLoaded", fetchCategories);
