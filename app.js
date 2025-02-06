// async function fdata() {
//     let apiData = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
//     console.log(apiData);
//      let {categories} = await apiData.json()
//     console.log(categories);
    
    
//     let cont = document.createElement('div')
//     categories.map(items =>{
//         cont.innerHTML += `
//         <h1>${items.strCategory}</h1>
//         <img src =${items.strCategoryThumb}>
//         `
//     })
//     document.body.append (cont)
// }
// fdata() 
function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
}