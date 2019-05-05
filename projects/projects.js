window.addEventListener('DOMContentLoaded', () => {
    let a = document.getElementById('personal');
    let repoType = 'personal';

    // Set tab
    const urlParams = new URLSearchParams (window.location.search);
    repoType = urlParams.get('tab');
    if (repoType) {
        a = document.getElementById(repoType);
    }
    a.classList.add('active');

    // Fetch repos
    fetch('https://api.github.com/users/joelbalmer/repos')
        .then(res => {
            return res.json();
        })
        .then(json => {
            setRepos(json, repoType);
        })
});

setRepos = (json, repoType) => {
    let isPersonal = true;
    let container = document.getElementById('cards-container');
    if (repoType) {
        isPersonal = repoType === 'personal' ? true : false;
    }

    // All repos
    const repos = json
        .sort((a, b) => {
            let date1;
            let date2;
            if (isPersonal) {
                date1 = new Date(b.pushed_at);
                date2 = new Date(a.pushed_at);
            } else {
                date1 = new Date(a.pushed_at);
                date2 = new Date(b.pushed_at);
            }
            return date1 - date2;
        });

    const projects = repos.filter(repo => repo.fork !== isPersonal);
    projects.forEach(project => {
        const card = createCard(project);
        container.appendChild(card);
    });
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

const tabClick = (event) => {
    const params = new URLSearchParams (window.location.search);
    params.set('tab', event.id);
    const loc = window.location;
    const url = `${loc.origin}${loc.pathname}?${params.toString()}`;
    window.location.href = url;
}