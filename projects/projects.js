window.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.github.com/users/joelbalmer/repos')
        .then(res => {
            return res.json();
        })
        .then(json => {
            setRepos(json);
        })
});

capitalise = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

setRepos = json => {
    const repos = json
    .sort((a, b) => {
        return new Date(b.crated_at)- new Date(a.created_at);
    })
    .filter(repo => repo.fork)
    .map(repo => {
        const name = repo.name.split('-').join(' ');
        return capitalise(name);
    })
    .forEach((str, i) => {
        console.log('Project ' + i + ': ' + str);
    });
}