// 1. appeler et formater la data
// 2. trier ladata par ordre alphabetique
// 3. faire apparaitre la data
// 4. filter la data quand on ecrit dans le input

// Nos deux selections
const searchInput = document.querySelector('#search');
const searchResult = document.querySelector('.table-results');

// Variable globale (remplie par la fonction getUsers())
let dataArray;

// La fonction qui sert a appeler les donnees depuis l'API
// pass async devant la fonction pour pouvoir utiliser await a l'interieur
// on travail aynchrone = on attend les resultats de l'API
async function getUsers() {
// J'attend les resultats de la methode fetch qui va chercher des donnees a notre API
// elle va les chercher en faisant une requete http a cette url en lui passant quelques query paramateres pour donner quelques informations supplementaires, plus precis.
    const res = await fetch('https://randomuser.me/api/?nat=fr&results=50') /* query params */
// des noms a consonance fr et un resultat ce limitant a 50 utilisateurs
// Notre fonction va continuer a se executer en attendant le retour de notre data
    const { results }  = await res.json()
    // Destructuring de result. Une fois le retour de notre API, on analyse le body de la requete. 
    console.log(results);
    // Je fais du destructuring et je cree une constante a partir de la propriete qu'il nous faut qui est un tableau. (gain du temps)
    
    dataArray = orderList(results)
    // console.log(dataArray)
    createUserList(dataArray)
}

getUsers();

// function utilitaire

function orderList(data) {
    // a et b tous les elements de mon tableau. 1er/2nd, 2nd/3ieme objet, etc...
    // en fonction des conditions qu'on met dans une function callback pour definir le tri
    // lowercase = on pass tjrs en minuscule des qu'on tri du texte, pour eviter des erreurs de casse
    const orderedData = data.sort((a,b) => {
        // chaque lettre a un code utf-16 (keycode), ca va comparer les keycodes et trier tout cela
        // l algo de tri utilise ce genre de code pour trier les lettres
        if(a.name.last.toLowerCase() < b.name.last.toLowerCase()) {
            return -1;
        }
        if(a.name.last.toLowerCase() > b.name.last.toLowerCase()) {
            return 1;
        }
        return 0;
    })
    // a la fin on retourn le tableau retourné par la method sort avec tous les elements triés
    return orderedData;
}

function createUserList(usersList) {
    // Permet de creer la list de tous les elements (table-item) et de les injecter dans le DOM
    // On itere a travers le tableau avec forEach
    usersList.forEach(user => { // Pour chaque objet ( chaque element du tableau) (cad chaque user) j'envoie cette foncion fléché
        // Creation du item list et ajoute du contenu a ce dernier, et contenu dynamique par rapport a l'objet
        const listItem = document.createElement("div");
        listItem.setAttribute("class","table-item")
        // Avec InnerHTML on va mettre tous les enfants au parent table-item
        listItem.innerHTML = `
                    <div class="container-img">
                        <img src=${user.picture.medium}>
                        <p class="name">${user.name.last} ${user.name.first}</p>
                    </div>
                    <p class="email">${user.email}</p>
                    <p class="phone">${user.phone}</p>`
        // la c'est juste une recheche, mais quand on injecte les donnees sur un site (ATTENTION)
        // sans backend oklm (mais lier les input avec innerHTML = pb de securite sur un blog)
        searchResult.appendChild(listItem);
    }) 

}

//// Filter par rapport a l'input

searchInput.addEventListener("input", filterData)

function filterData(e) {

    searchResult.innerHTML = ""

    const searchedString = e.target.value.toLowerCase().replace(/\s/g, ""); // ca va enlever les espaces

    // filter pour filter et retourner un tableau avec les el qui ont passer le filtre
    const filteredArr = dataArray.filter(el => 
        el.name.first.toLowerCase().includes(searchedString) ||
        el.name.last.toLowerCase().includes(searchedString) ||
        `${el.name.last + el.name.first}`.toLowerCase().replace(/\s/g, "").includes(searchedString) ||
        `${el.name.first + el.name.last}`.toLowerCase().replace(/\s/g, "").includes(searchedString)
    );
    createUserList(filteredArr) // on reutilise une des fonction qu'on a creer
}