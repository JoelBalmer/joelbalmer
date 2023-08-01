import { printMousePos } from './../utils/circle-click.js';

// Global reference to wait for async img loading
let magicGrid;

window.addEventListener('DOMContentLoaded', () => {

    // Set the correct tab
    let a = document.getElementById ('personal');
    let repoType = 'personal';

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

            // Animate elements
            let hr = document.getElementsByTagName('hr')[0];
            hr.classList.add('animate-width', 'animate-fadein');

            let container = document.getElementById('cards-container');
            container.classList.add('animate-fadein');
        });

    // Setup events
    window.addEventListener('click', printMousePos);
});

const setRepos = (json, repoType) => {
    let isPersonal = true;
    let container = document.getElementById('cards-container');

    if (repoType) {
        isPersonal = repoType === 'personal' ? true : false;

        if (repoType === 'experiments') {
            const projects = [
                {
                    name: 'SprintBet',
                    full_name: 'SprintBet',
                    description: 'Realtime voting app for planning poker',
                    html_url: 'https://sprintbet.dev',
                    imgSrc: '/res/img/sprintbet.png'
                },
                {
                    name: 'Rachel Skea Portfolio',
                    full_name: 'Rachel Skea Portfolio',
                    description: 'Website for the talented Rachel Skea, built with Next.js and Contentful CMS',
                    html_url: 'https://rach-frontend.vercel.app',
                    imgSrc: '/res/img/rach.png'
                },
                {
                    name: 'Projects timeline',
                    full_name: 'Projects timeline',
                    description: 'Interactable timeline entries, using latest angular version',
                    html_url: 'https://timeline.experiments.joelbalmer.me',
                    imgSrc: '/res/img/timeline-sm.png'
                }
            ];
            
            projects.forEach(project => {
                const card = createCard(project);
                container.appendChild(card);
            });
        
            magicGrid = new MagicGrid({
                container: "#cards-container",
                items: projects.length,
                animate: true,
                maxColumns: 3,
                gutter: 30
            });
        
            magicGrid.listen();
            magicGrid.positionItems();

            return;
        }
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

    magicGrid = new MagicGrid({
        container: "#cards-container",
        items: projects.length,
        animate: true,
        maxColumns: 3,
        gutter: 30
    });

    magicGrid.listen();
    magicGrid.positionItems();
}

const formatTitle = string => {
    const name = string.split('-').join(' ');
    return name.charAt(0).toUpperCase() + name.slice(1);
}

const createCard = repo => {
    // Create html elements and classes
    let linkWrapperDiv = document.createElement('div');
    linkWrapperDiv.classList.add('link-wrapper');
    let repoLink = document.createElement('a');
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";
    let divCard = document.createElement('div');
    divCard.classList.add('card', 'flex-fill');
    let h5 = document.createElement('h5');
    h5.classList.add('title');
    let img = new Image;
    img.classList.add('img-top');
    let divBody = document.createElement('div');
    divBody.classList.add('body', 'flex-fill', 'flex-column');
    let p = document.createElement('p');
    p.classList.add('text', 'flex-fill');

    // Set values from repo
    h5.innerHTML = formatTitle(repo.name);
    img.addEventListener("load", () => {
        magicGrid.positionItems();
    });
    img.src = repo.imgSrc || `https://raw.githubusercontent.com/${repo.full_name}/master/project-image.png`;
    p.innerHTML = repo.description;

    // Arrange and return
    linkWrapperDiv.appendChild(repoLink);
    repoLink.appendChild(divCard);
    divCard.appendChild(h5);
    divCard.appendChild(img);
    divCard.appendChild(divBody);
    divBody.appendChild(p);

    return linkWrapperDiv;
}

window.tabClick = (event) => {
    const params = new URLSearchParams (window.location.search);
    params.set('tab', event.id);
    const loc = window.location;
    const url = `${loc.origin}${loc.pathname}?${params.toString()}`;
    window.location.href = url;
}