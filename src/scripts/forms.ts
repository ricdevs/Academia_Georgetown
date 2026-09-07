import { withBase } from '../lib/url';

export function initLeadForms() {
  const key = (import.meta as ImportMeta & { env: Record<string, string> }).env
    ?.PUBLIC_RECAPTCHA_SITE_KEY || '6LdkAjQcAAAAACkQdK9O5RzVo8kMLnRgHUOwgiAv';

  document.querySelectorAll<HTMLFormElement>('.js-lead-form').forEach((form) => {
    if (form.dataset.bound) return;
    form.dataset.bound = '1';
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector<HTMLElement>('.js-form-status');
      const data = Object.fromEntries(new FormData(form).entries());
      try {
        let recaptchaToken = '';
        const grecaptcha = (window as unknown as { grecaptcha?: { execute: Function; ready: Function } }).grecaptcha;
        if (grecaptcha) {
          recaptchaToken = await new Promise((resolve) => {
            grecaptcha.ready(() => {
              grecaptcha.execute(key, { action: 'submit' }).then(resolve);
            });
          });
        }
        const res = await fetch(withBase('/api/submit'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, recaptchaToken }),
        });
        if (!res.ok) throw new Error('fail');
        if (status) {
          status.textContent = 'Gracias. Nos pondremos en contacto contigo.';
          status.classList.remove('hidden');
          status.classList.add('text-navy');
        }
        form.reset();
      } catch {
        if (status) {
          status.textContent = 'No se pudo enviar. Escríbenos a info@academiageorgetown.es o llama al 948 17 51 48.';
          status.classList.remove('hidden');
        }
      }
    });
  });
}

declare global {
  interface Window {
    loadMarketing?: () => void;
  }
}
