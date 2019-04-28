window.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.github.com/users/joelbalmer/repos')
        .then(function(res) {
            return res.json();
        })
        .then(function(json) {
            console.log('JSON', json.filter (repo => repo.fork));
        })
});
