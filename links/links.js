window.addEventListener('DOMContentLoaded', () => {
  let magicGrid = new MagicGrid({
    container: "#links-container",
    static: true,
    animate: true,
    maxColumns: 3
  });

  magicGrid.listen();
  magicGrid.positionItems();

  // Animate elements
  let hr = document.getElementsByTagName('hr')[0];
  hr.classList.add('animate-width', 'animate-fadein');

  let container = document.getElementById('links-container');
  setTimeout(() => container.classList.add('animate-fadein'), 500);
});