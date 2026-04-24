export function renderArnie(arnie) {
  document.getElementById('arnieGrid').innerHTML =
    arnie.map(a => `
      <div class="card">
        <strong>${a.nome}</strong>
        <div class="badge">attiva</div>
      </div>
    `).join('');
}

export function renderArniaSelect(arnie) {
  document.getElementById('logArnia').innerHTML =
    arnie.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
}

export function renderLogs(logs, arnie) {
  const map = Object.fromEntries(arnie.map(a=>[a.id,a.nome]));

  document.getElementById('logEntries').innerHTML =
    logs.map(l => `
      <div class="card">
        <div><strong>${map[l.arniaId] || ''}</strong></div>
        <div>${l.note}</div>
        <small>${l.data}</small>
      </div>
    `).join('');
}

export function renderMagazzino(items) {
  document.getElementById('magGrid').innerHTML =
    items.map(i => `
      <div class="card">
        ${i.nome} (${i.giacenza} ${i.unita})
        <button data-mov="${i.id}">Movimento</button>
      </div>
    `).join('');
}

export function renderMovimenti(mov, items) {
  const map = Object.fromEntries(items.map(i=>[i.id,i.nome]));

  document.getElementById('movList').innerHTML =
    mov.map(m => `
      <div class="card">
        ${map[m.articoloId]} → ${m.tipo} ${m.qta}
      </div>
    `).join('');
}
