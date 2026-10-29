const ENDPOINT = 'https://feelingmachines.goatcounter.com/count';

// Only explicit summary activations count; automatic deep-link expansion does not.
export function bindExpandoEvents(root, send) {
  root.querySelectorAll('details[data-analytics]').forEach(details => {
    const summary = details.querySelector(':scope > summary');
    if (!summary) return;
    let requestedState;
    summary.addEventListener('click', event => {
      if (event.defaultPrevented || event.target.closest('a, button, input')) return;
      requestedState = !details.open;
    });
    details.addEventListener('toggle', () => {
      if (details.open !== requestedState) return;
      requestedState = undefined;
      const action = details.open ? 'open' : 'close';
      send({
        path: `kingson-${action}-${details.dataset.analytics}`,
        title: `${summary.textContent.trim()}: ${action}`,
        event: true,
        no_session: true,
        referrer: '',
      });
    });
  });
}

// Preview visits never load the tracker or send events.
if (typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    ['feelingmachines.net', 'www.feelingmachines.net'].includes(window.location.hostname) &&
    ['/kingson', '/kingson/'].includes(window.location.pathname)) {
  window.goatcounter = { path: '/kingson/', no_events: true };
  const pending = [];
  const send = event => {
    if (typeof window.goatcounter.count === 'function') {
      window.goatcounter.count(event);
    } else if (pending.length < 50) {
      pending.push(event);
    }
  };
  bindExpandoEvents(document, send);
  const tracker = document.createElement('script');
  tracker.src = 'https://gc.zgo.at/count.js';
  tracker.async = true;
  tracker.dataset.goatcounter = ENDPOINT;
  tracker.addEventListener('load', () => {
    if (typeof window.goatcounter.count !== 'function') return;
    pending.splice(0).forEach(send);
  });
  document.head.appendChild(tracker);
}
