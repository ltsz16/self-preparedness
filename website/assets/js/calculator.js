// Ready at Home — Food Storage Calculator
// Source data from food/foodstorage.md
// Level I: per adult per year quantities
// Level II: per adult per year quantities (based on 2,000 cal/day diet for age 14+)
// Age multipliers: Children's requirements section of foodstorage.md

'use strict';

// ── Level I data ──────────────────────────────────────────────────────────────
const LEVEL1 = [
  {
    item: 'Grains',
    examples: 'wheat, flour, rice, corn, oatmeal, pasta',
    qty: 300,
    unit: 'lbs',
  },
  {
    item: 'Legumes',
    examples: 'dry beans, split peas, lentils',
    qty: 60,
    unit: 'lbs',
  },
  {
    item: 'Powdered Milk',
    examples: 'non-fat dry milk',
    qty: 16,
    unit: 'lbs',
  },
  {
    item: 'Cooking Oil',
    examples: 'vegetable, olive, coconut',
    qty: 10,
    unit: 'quarts',
  },
  {
    item: 'Sweetener',
    examples: 'sugar, honey',
    qty: 60,
    unit: 'lbs',
  },
  {
    item: 'Salt',
    examples: 'iodized preferred',
    qty: 8,
    unit: 'lbs',
  },
];

// ── Level II data ─────────────────────────────────────────────────────────────
const LEVEL2 = [
  {
    item: 'Fruit',
    examples: 'raw, frozen, cooked, canned, dried fruit, or juice',
    qty: 45.75,
    unit: 'gallons',
  },
  {
    item: 'Vegetables',
    examples: 'raw, cooked, canned, leafy greens, or juice',
    qty: 57,
    unit: 'gallons',
  },
  {
    item: 'Protein',
    examples: 'lean meat, poultry, seafood, eggs, nuts, legumes',
    qty: 125.5,
    unit: 'lbs',
  },
  {
    item: 'Dairy',
    examples: 'milk, yogurt, natural cheese, fortified soy milk',
    qty: 65.5,
    unit: 'gallons',
  },
];

// ── Age multipliers (Children's requirements - foodstorage.md Level I) ────────
// 11 and up  → 1.00 (full adult)
// 7 to 10    → 0.90
// 4 to 6     → 0.70
// 3 and under→ 0.50

// ── Calculate ─────────────────────────────────────────────────────────────────
function calculate() {
  var a = Math.max(0, parseInt(document.getElementById('cnt-11plus').value, 10) || 0);
  var b = Math.max(0, parseInt(document.getElementById('cnt-7to10').value,  10) || 0);
  var c = Math.max(0, parseInt(document.getElementById('cnt-4to6').value,   10) || 0);
  var d = Math.max(0, parseInt(document.getElementById('cnt-3under').value,  10) || 0);

  var total = a + b + c + d;
  if (total === 0) {
    alert('Please enter at least one household member to calculate.');
    return;
  }

  // Compute adult equivalents
  var ae = (a * 1.0) + (b * 0.9) + (c * 0.7) + (d * 0.5);

  // Update summary
  var memberWord = total === 1 ? 'member' : 'members';
  document.getElementById('results-summary').innerHTML =
    'Your household has <strong>' + total + ' ' + memberWord + '</strong>' +
    ' (<strong>' + ae.toFixed(2) + ' adult equivalents</strong>).' +
    ' The tables below show the recommended one-year food storage for your entire household.';

  renderTable('results-table-l1', LEVEL1, ae);
  renderTable('results-table-l2', LEVEL2, ae);

  var resultsEl = document.getElementById('calc-results');
  resultsEl.classList.add('visible');
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Render a result table body ────────────────────────────────────────────────
function renderTable(tableId, items, ae) {
  var tbody = document.querySelector('#' + tableId + ' tbody');
  tbody.innerHTML = '';

  items.forEach(function (row) {
    var rawTotal = ae * row.qty;
    // Display whole numbers as integers, fractions to 2 dp
    var displayTotal = Number.isInteger(rawTotal)
      ? rawTotal.toLocaleString()
      : parseFloat(rawTotal.toFixed(2)).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });

    var adultDisplay = row.qty % 1 === 0
      ? row.qty.toLocaleString()
      : row.qty.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><strong>' + row.item + '</strong>' +
        (row.examples ? '<br><span class="item-examples">' + row.examples + '</span>' : '') +
      '</td>' +
      '<td>' + adultDisplay + ' ' + row.unit + '</td>' +
      '<td><strong>' + displayTotal + ' ' + row.unit + '</strong></td>';
    tbody.appendChild(tr);
  });
}

// ── Reset ─────────────────────────────────────────────────────────────────────
function resetCalculator() {
  ['cnt-11plus', 'cnt-7to10', 'cnt-4to6', 'cnt-3under'].forEach(function (id) {
    document.getElementById(id).value = '';
  });
  var resultsEl = document.getElementById('calc-results');
  resultsEl.classList.remove('visible');
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('calc-btn').addEventListener('click', calculate);
  document.getElementById('reset-btn').addEventListener('click', resetCalculator);

  // Allow Enter key in any input field to trigger calculation
  document.querySelectorAll('.calc-input').forEach(function (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') calculate();
    });
  });
});
