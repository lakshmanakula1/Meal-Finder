function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
}

// Fetch and display categories dynamically
async function fdata() {
    try {
        let apiData = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        let { categories } = await apiData.json();
        
        let cont = document.getElementById('category');
        cont.innerHTML = ""; 

        categories.forEach(item => {
            let div = document.createElement("div");
            div.classList.add("item");

            div.innerHTML = `
                <img src="${item.strCategoryThumb}" alt="${item.strCategory}">
                <div class="label">${item.strCategory}</div>
            `;

            div.addEventListener("click", () => {
                fetchMealsByCategory(item.strCategory);
                cont.style.display = "none"; 
                document.getElementById("headcategories").style.display = "none";
                document.getElementById("mealHeader").style.display = "block";
                document.getElementById("backButton").style.display = "block"; 
            });

            cont.appendChild(div);
        });


        addSidebarListeners();
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}


// Fetch Meals by Category
async function fetchMealsByCategory(categoryName) {
    let apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`;
    let apiData = await fetch(apiUrl);
    let { meals } = await apiData.json();

    let mealContainer = document.getElementById('meals');
    mealContainer.innerHTML = ""; 

    meals.forEach(meal => {
        let mealDiv = document.createElement("div");
        mealDiv.classList.add("meal-item");

        mealDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="label1">${meal.strMeal}</div>
        `;

        
        mealDiv.addEventListener("click", () => {
            fetchMealDetails(meal.idMeal);
        });

        mealContainer.appendChild(mealDiv);
    });

    document.getElementById("sidebar").classList.remove("active"); 
}


async function fetchMealDetails(mealId) {
    const mealContainer = document.getElementById("meal-container");

    if (!mealContainer) {
        console.error("Error: meal-container not found in the DOM.");
        return;
    }

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    const meal = data.meals[0];

    let ingredients = "";
    let measurements = [];

    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            ingredients += `<li><span class="ingredient-number">${i}</span> ${ingredient}</li>`;
            measurements.push(`<li>🥄 ${measure} ${ingredient}</li>`);
        }
    }

    let mealDetails = `
        <div class="meal-details-container">
            <div class="meal-header">
                <h2>${meal.strMeal}</h2>
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <p><strong>Source:</strong> <a href="${meal.strSource}" target="_blank">${meal.strSource}</a></p>
                <p><strong>Tags:</strong> <span class="meal-tag">${meal.strTags ? meal.strTags.split(',').join(', ') : 'N/A'}</span></p>
            </div>

            <div class="meal-content">
                <div class="meal-image">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>

                <div class="meal-ingredients">
                    <h3>Ingredients</h3>
                    <ul>${ingredients}</ul>
                </div>
            </div>

            <div class="meal-measure">
                <h3>Measure:</h3>
                <ul class="measure-list">${measurements.join('')}</ul>
            </div>

            <div class="meal-instructions">
                <h3>Instructions:</h3>
                <ul>
                    ${meal.strInstructions.split('. ').map(step => step ? `<li>✅ ${step}.</li>` : '').join('')}
                </ul>
            </div>
        </div>
    `;

    mealContainer.innerHTML = mealDetails;
    document.getElementById("meals").style.display = "none";
} 

// Search Meals by Name

async function searchMeal() {
    let searchQuery = document.getElementById("searchbar").value.trim();
    if (searchQuery === "") return;

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

            
            mealDiv.addEventListener("click", () => {
                fetchMealDetails(meal.idMeal);
            });

            mealContainer.appendChild(mealDiv);
        });
    } else {
        mealContainer.innerHTML = `<p style="text-align:center; font-size:20px; color:red;">No meals found!</p>`;
    }
}



function addSidebarListeners() {
    let sidebarItems = document.querySelectorAll(".sidebar ul li");

    sidebarItems.forEach(item => {
        item.addEventListener("click", function () {
            let category = this.innerText.trim();
            fetchMealsByCategory(category);
            document.getElementById("category").style.display = "none"; 
            document.getElementById("backButton").style.display = "block"; 
        });
    });
}

// Show categories again when Back button is clicked
function showCategories() {
    document.getElementById("category").style.display = "flex";
    document.getElementById("meals").innerHTML = "";
    document.getElementById("backButton").style.display = "none"; 
}

fdata();




document.getElementById("searchicon").addEventListener("click", () => {
    console.log("Search button clicked!");
    searchMeal();
    document.getElementById("headcategories").style.display = "none";
    document.getElementById("category").style.display = "none";
});
async function searchMeal() {
    let query = document.getElementById("searchbar").value.trim();
    console.log("Searching for:", query); 

    if (query === "") {
        alert("Please enter a meal name to search.");
        return;
    }

    let apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    try {
        let response = await fetch(apiUrl);
        let data = await response.json();

        let mealContainer = document.getElementById('meals');
        mealContainer.innerHTML = "";

        if (data.meals) {
            document.getElementById("mealHeader").style.display = "block";
            data.meals.forEach(meal => {
                let mealDiv = document.createElement("div");
                mealDiv.classList.add("meal-item");
                mealDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                `;
                mealDiv.addEventListener("click", () => fetchMealDetails(meal.idMeal));
                mealContainer.appendChild(mealDiv);
            });
        } else {
            mealContainer.innerHTML = `<p>No meals found!</p>`;
        }
    } catch (error) {
        console.error("Error fetching meals:", error);
    }
}


document.getElementById("searchicon").addEventListener("click", searchMeal);


document.getElementById("searchbar").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchMeal();
    }
});





