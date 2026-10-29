// Reveal the containing section when following a deep link into the archive.
(() => {
  function revealTarget() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    if (['talks', 'research', 'about'].includes(id)) target.querySelector('details').open = true;
    for (let node = target; node; node = node.parentElement) {
      if (node.tagName === 'DETAILS') node.open = true;
    }
    target.scrollIntoView();
  }
  addEventListener('hashchange', revealTarget);
  if (location.hash) revealTarget();
})();
