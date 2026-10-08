const SUPABASE_URL = "https://rtptyioaflynautslif.supabase.co";
const SUPABASE_KEY = "sb_publishable_FcCJBPG-Vg0SiaEVaVd_ZQ_AE_wEZl1";

const client = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let allBooks = [];

const booksContainer = document.getElementById("books");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const statusText = document.getElementById("status");


async function loadBooks() {

    const { data, error } = await client
        .from("books")
        .select(`
            id,
            title,
            price,
            authors (
                name
            )
        `);

    if (error) {
        console.error(error);
        statusText.textContent = "Ошибка загрузки данных";
        return;
    }

    allBooks = data;
    statusText.textContent = "";
    displayBooks();
}


function displayBooks() {

    let books = [...allBooks];

    // ПОИСК
    const searchText = searchInput.value.toLowerCase();
    books = books.filter(book => {
        const title = book.title?.toLowerCase() || "";
        const author = book.authors?.name?.toLowerCase() || "";
        return (
            title.includes(searchText) ||
            author.includes(searchText)
        );
    });

    // СОРТИРОВКА
    const sort = sortSelect.value;

    if (sort === "title-asc") {
        books.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sort === "title-desc") {
        books.sort((a, b) => b.title.localeCompare(a.title));
    }
    if (sort === "price-asc") {
        books.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sort === "price-desc") {
        books.sort((a, b) => Number(b.price) - Number(a.price));
    }

    // ВЫВОД КНИГ
    booksContainer.innerHTML = "";

    if (books.length === 0) {
        booksContainer.innerHTML = "<p>Книги не найдены</p>";
        return;
    }

    books.forEach(book => {
        const div = document.createElement("div");
        div.className = "book";

        div.innerHTML = `
            <h2>${book.title}</h2>
            <p class="author">
                Автор: ${book.authors?.name ?? "Не указан"}
            </p>
            <p class="price">
                ${book.price} ₸
            </p>
        `;

        booksContainer.appendChild(div);
    });
}

searchInput.addEventListener("input", displayBooks);
sortSelect.addEventListener("change", displayBooks);

loadBooks();
