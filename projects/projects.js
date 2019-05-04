window.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.github.com/users/joelbalmer/repos')
        .then(res => {
            return res.json();
        })
        .then(json => {
            setRepos(json);
        })
});

setRepos = json => {
    // All repos
    const repos = json
        .sort((a, b) => {
            return new Date(b.pushed_at) - new Date(a.pushed_at);
        });
    
    // Just forks
    const forks = repos.filter(repo => repo.fork);
    const card1 = createCard(forks[0]);
    const card2 = createCard(forks[1]);
    const card3 = createCard(forks[2]);

    // Add to html
    let container = document.getElementById('cards-container');
    container.appendChild(card3);
    container.appendChild(card2);
    container.appendChild(card1);
}

formatTitle = string => {
    const name = string.split('-').join(' ');
    return name.charAt(0).toUpperCase() + name.slice(1);
}

createCard = repo => {
    // Create html elements and classes
    let divCard = document.createElement('div');
    divCard.classList.add('card', 'flex-fill');
    let h5 = document.createElement('h5');
    h5.classList.add('title');
    let img = document.createElement('img');
    img.classList.add('img-top');
    let divBody = document.createElement('div');
    divBody.classList.add('body', 'flex-fill', 'flex-column');
    let p = document.createElement('p');
    p.classList.add('text', 'flex-fill');
    let a = document.createElement('a');
    a.classList.add('card-link');

    // Set values from repo
    h5.innerHTML = formatTitle(repo.name);
    img.src = `https://raw.githubusercontent.com/${repo.full_name}/master/project-image.png`;
    p.innerHTML = repo.description;  
    a.innerHTML = "See project";
    a.href = repo.html_url;

    // Arrange and return
    divCard.appendChild(h5);
    divCard.appendChild(img);
    divCard.appendChild(divBody);
    divBody.appendChild(p);
    divBody.appendChild(a);

    return divCard;
}