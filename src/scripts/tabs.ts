/**
 * Abas acessíveis (padrão WAI-ARIA Tabs, ativação automática).
 * Marcação: [data-tabs] > [role=tablist] > [role=tab][aria-controls] + [role=tabpanel]
 */
export function initTabs(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-tabs]').forEach((group) => {
    if (group.dataset.tabsReady) return;
    group.dataset.tabsReady = 'true';

    const tabs = Array.from(group.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    // Aceita os dois eixos: a lista vira horizontal no mobile.

    const select = (tab: HTMLButtonElement, focus = true) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls') ?? '');
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (e) => {
        const map: Record<string, number> = {
          ArrowRight: i + 1, ArrowDown: i + 1,
          ArrowLeft: i - 1, ArrowUp: i - 1,
          Home: 0, End: tabs.length - 1,
        };
        if (e.key in map) {
          e.preventDefault();
          select(tabs[(map[e.key] + tabs.length) % tabs.length]);
        }
      });
    });
  });
}

export function initCopyButtons(root: ParentNode = document) {
  root.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const original = btn.textContent;
      try {
        await navigator.clipboard.writeText(btn.dataset.copy ?? '');
        btn.textContent = 'Copiado';
      } catch {
        btn.textContent = 'Selecione e copie';
      }
      setTimeout(() => (btn.textContent = original), 1600);
    });
  });
}
