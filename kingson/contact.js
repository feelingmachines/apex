// This delays disclosure to discourage basic email harvesters; it is not encryption.
(() => {
  const button = document.querySelector('.email-reveal');
  const link = document.getElementById('email-address');
  if (!button || !link) return;

  button.addEventListener('click', () => {
    const encoded = [80, 82, 85, 92, 72, 84, 85, 123, 93, 94, 94, 87, 82, 85, 92, 86, 90, 88, 83, 82, 85, 94, 72, 21, 85, 94, 79];
    const address = String.fromCharCode(...encoded.map(value => value ^ 59));
    link.textContent = address;
    link.href = `mailto:${address}`;
    link.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    button.hidden = true;
    link.focus();
  }, { once: true });

  button.hidden = false;
})();
