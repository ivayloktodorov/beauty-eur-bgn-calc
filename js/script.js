// Fixed conversion rate
const RATE = 1.95583; // 1 EUR = 1.95583 BGN

const priceEur = document.getElementById('price-eur');
const priceBgn = document.getElementById('price-bgn');
const paidEur = document.getElementById('paid-eur');
const paidBgn = document.getElementById('paid-bgn');
const changeEur = document.getElementById('change-eur');
const changeBgn = document.getElementById('change-bgn');

let suppress = false;

function parseNumber(v){
  if (v === null || v === undefined) return NaN;
  v = String(v).trim().replace(',','.');
  if (v === '') return NaN;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function fmt(n){
  if (!Number.isFinite(n)) return '—';
  // show two decimals
  return n.toFixed(2);
}

function setValueSafely(el, value){
  suppress = true;
  el.value = value;
  setTimeout(()=> suppress = false, 0);
}

function setOutputSafely(el, value){
  el.textContent = value;
}

function onInput(source){
  if (suppress) return;

  // Sync price fields
  if (source === priceEur){
    const v = parseNumber(priceEur.value);
    if (Number.isFinite(v)) setValueSafely(priceBgn, fmt(v * RATE));
    else setValueSafely(priceBgn, '');
  }
  if (source === priceBgn){
    const v = parseNumber(priceBgn.value);
    if (Number.isFinite(v)) setValueSafely(priceEur, fmt(v / RATE));
    else setValueSafely(priceEur, '');
  }

  // Sync paid fields
  if (source === paidEur){
    const v = parseNumber(paidEur.value);
    if (Number.isFinite(v)) setValueSafely(paidBgn, fmt(v * RATE));
    else setValueSafely(paidBgn, '');
  }
  if (source === paidBgn){
    const v = parseNumber(paidBgn.value);
    if (Number.isFinite(v)) setValueSafely(paidEur, fmt(v / RATE));
    else setValueSafely(paidEur, '');
  }

  const newPE = parseNumber(priceEur.value);
  const newPB = parseNumber(priceBgn.value);
  const newPaidE = parseNumber(paidEur.value);
  const newPaidB = parseNumber(paidBgn.value);

  // Compute change
  if (Number.isFinite(newPE) && Number.isFinite(newPaidE)){
    const chE = newPaidE - newPE;
    setOutputSafely(changeEur, fmt(chE) + ' €');
    setOutputSafely(changeBgn, fmt(chE * RATE) + ' лв.');
    return;
  }

  if (Number.isFinite(newPB) && Number.isFinite(newPaidB)){
    const chB = newPaidB - newPB;
    setOutputSafely(changeBgn, fmt(chB) + ' лв.');
    setOutputSafely(changeEur, fmt(chB / RATE) + ' €');
    return;
  }

  setOutputSafely(changeEur, '—');
  setOutputSafely(changeBgn, '—');
}

[priceEur, priceBgn, paidEur, paidBgn].forEach(el => {
  el.addEventListener('input', ()=> onInput(el));
});

onInput(null);
