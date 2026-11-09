/**
 * Mass General Brigham — Neuroscience Institute Launchpad (nsil2)
 * Theme toggle, declarative dialog fallback, and inquiry form handler.
 */

const schemeMeta = document.querySelector('meta[name="color-scheme"]');
const themeBtn = document.getElementById('theme-toggle');

function syncThemeLabel() {
  if (!schemeMeta || !themeBtn) return;
  const isDark = schemeMeta.content === 'dark';
  themeBtn.textContent = isDark ? 'Light Theme' : 'Dark Theme';
}

syncThemeLabel();

if (themeBtn && schemeMeta) {
  themeBtn.addEventListener('click', () => {
    const next = schemeMeta.content === 'dark' ? 'light' : 'dark';
    schemeMeta.content = next;
    try {
      localStorage.setItem('mgb-nsil2-scheme', next);
    } catch (e) {}
    syncThemeLabel();
  });
}

// Polyfill for commandfor/command on older browsers + backdrop light-dismiss
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[commandfor][command]');
  if (trigger) {
    const dialog = document.getElementById(trigger.getAttribute('commandfor'));
    const cmd = trigger.getAttribute('command');
    if (dialog instanceof HTMLDialogElement) {
      if (cmd === 'show-modal' && !dialog.open) {
        dialog.showModal();
      } else if (cmd === 'close' && dialog.open) {
        dialog.close();
      }
    }
  }

  if (
    event.target instanceof HTMLDialogElement &&
    event.target.open &&
    event.target.getAttribute('closedby') === 'any'
  ) {
    const rect = event.target.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) {
      event.target.close();
    }
  }
});

// Pre-select inquiry option when clicking an engagement button
const inquiryModal = document.getElementById('inquiry-modal');
const inquiryType = document.getElementById('inquiry-type');

document.querySelectorAll('[data-inquiry-option]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const option = btn.getAttribute('data-inquiry-option');
    if (inquiryType && option) {
      inquiryType.value = option;
    }
    if (inquiryModal instanceof HTMLDialogElement && !inquiryModal.open) {
      inquiryModal.showModal();
    }
  });
});

// Inquiry form mailto preparation
const inquiryForm = document.getElementById('inquiry-form');
const inquiryStatus = document.getElementById('inquiry-status');

if (inquiryForm) {
  inquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(inquiryForm);
    const type = String(data.get('type') || 'MGB NSI Launchpad Inquiry');
    const name = String(data.get('name') || '');
    const email = String(data.get('email') || '');
    const org = String(data.get('organization') || '');
    const notes = String(data.get('notes') || '');

    const subject = encodeURIComponent(`[MGB NSI Launchpad] ${type} — ${name}`);
    const body = encodeURIComponent(
      `Area of Interest: ${type}\nName: ${name}\nEmail: ${email}\nOrganization / Department: ${org}\n\nMessage:\n${notes}\n`
    );

    if (inquiryStatus) {
      inquiryStatus.hidden = false;
      inquiryStatus.textContent = 'Opening your email client with your inquiry details...';
    }

    window.location.href = `mailto:phadar@mgb.org?subject=${subject}&body=${body}`;
  });
}
