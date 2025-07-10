const BASE_URL = 'http://43.205.110.71:8000';
const ITEMS_PER_PAGE = 12;

const root = document.getElementById('root');

let categoryData = [];
let selectedCategory = '';

let items = [];
let currentPage = 1;

const fetchCategories = async () => {
    try {
        const response = await fetch(`${BASE_URL}/categories`);
        let categories = await response.json();

        categories.forEach(category => {
            categoryData.push(category['category'])
        });
        addCategoriesToDom();
    } catch (error) {
        console.log(error);
    }
}
const addCategoriesToDom = () => {
    const cat = document.getElementById("categories");

    categoryData.forEach(category => {
        const div = document.createElement('div');
        div.classList.add('category-item');
        div.textContent = category;
        div.id = category;
        cat.appendChild(div);
    });
}
const selectCategory = (cat) => {
    if (selectedCategory !== '') {
        document.getElementById(selectedCategory).classList.remove('selected');
    }
    if (cat === selectedCategory) {
        selectedCategory = "";
        return;
    }
    document.getElementById(cat).classList.add('selected');
    selectedCategory = cat;
}

const fetchItems = async () => {
    try {
        let lower = ITEMS_PER_PAGE * currentPage;
        const response = await fetch(`${BASE_URL}/items/batch?ids=${lower},${lower + ITEMS_PER_PAGE}`);
        let re = await response.json();

        currentPage++;
        items.length = 0
        items.push(...re);
        addItemsToDom();
    } catch (error) {
        if (error.status === 400) {
            console.log('No more items');
        } else {
            console.log(error);
        }
    }
}
const addItemsToDom = () => {
    const itemDiv = document.getElementById('items');
    itemDiv.replaceChildren();

    items.forEach(item => {
        console.log(item);
        const div = document.createElement('div');
        div.classList.add('item-card');

        const h3 = document.createElement('h3');
        h3.textContent = item['name'];

        const p = document.createElement('p');
        p.textContent = item['description'];

        const img = document.createElement('img');
        img.src = "https://blocks.astratic.com/img/general-img-landscape.png";

        div.replaceChildren(img, h3, p);
        itemDiv.appendChild(div);
    });
}

const init = async () => {
    await Promise.all([fetchCategories(), fetchItems()]);
}
root.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-item')) {
        console.log(e.target.id);
        selectCategory(e.target.id);
    }
})
document.addEventListener('DOMContentLoaded', init);
