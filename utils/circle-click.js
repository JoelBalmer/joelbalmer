export const printMousePos = event => {
  let circle = document.getElementById ('circle-click');
  circle.style.left = event.clientX - 10 + 'px';
  circle.style.top = event.clientY - 10 + 'px';

  // Continue fade animation
  circle.classList.add ('fade-in-out');
  circle.addEventListener ('animationend', () => {
    circle.classList.remove ('fade-in-out');
  });
  circle.addEventListener ('webkitAnimationEnd', () => {
    circle.classList.remove ('fade-in-out');
  });
};
