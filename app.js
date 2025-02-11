function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
}
async function fdata() {
    let apiData = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    console.log(apiData);
     let {categories} = await apiData.json()
    console.log(categories);
    
    
    let cont = document.getElementById('category')
    categories.map(items =>{
        cont.innerHTML += `
        <div class="item">
        <img src =${items.strCategoryThumb}>
        <div class="label">${items.strCategory}</div>

        </div>
        
        `
    })
    document.body.append (cont)
}
fdata() 