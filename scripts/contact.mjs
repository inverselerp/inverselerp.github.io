// The contact page only. No requests, storage, or third-party code.
export function buildEmailDraft(recipient, { name, email, message }) {
  const cleanName = name.trim().replace(/[\r\n]+/g, ' ');
  const cleanEmail = email.trim();
  const cleanMessage = message.trim().replace(/\r?\n/g, '\r\n');
  if (!cleanName || !cleanEmail || !cleanMessage) {
    throw new Error('Please enter your name, email, and a message.');
  }
  const subject = `Website inquiry — ${cleanName}`;
  const body = `Name: ${cleanName}\r\nReply email: ${cleanEmail}\r\n\r\n${cleanMessage}`;
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('#contact-form');
  if (form) {
    const status = document.querySelector('#contact-status');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      try {
        const values = new FormData(form);
        const draft = buildEmailDraft(form.dataset.recipient, {
          name: String(values.get('name') ?? ''),
          email: String(values.get('email') ?? ''),
          message: String(values.get('message') ?? ''),
        });
        status.textContent = 'Opening your email app… Review and send the draft there. If nothing opens, copy the email address above. Your message is still here.';
        window.location.href = draft;
      } catch (error) {
        status.textContent = error instanceof Error ? error.message : 'Could not prepare the draft. Please use the email link above.';
      }
    });
    // Enable only after the handler is attached. Without JS, the direct link works.
    form.querySelector('fieldset').disabled = false;
  }
}
