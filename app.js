const BASE_RATES = {
  USD: 1.0000,
  EUR: 0.9201,
  GBP: 0.7887,
  INR: 83.4700,
  JPY: 153.8200,
  AUD: 1.5312,
  CAD: 1.3641,
  SGD: 1.3478,
  AED: 3.6725,
  MXN: 17.1540,
};

const INITIAL_EXPENSES = [
  { id: 1, date: "2026-02-03", merchant: "Indigo Airlines", amount: 8200, currency: "INR", category: "Travel" },
  { id: 2, date: "2026-02-10", merchant: "Slack Pro", amount: 12.50, currency: "USD", category: "Software" },
  { id: 3, date: "2026-02-14", merchant: "Dishoom London", amount: 68.40, currency: "GBP", category: "Food" },
  { id: 4, date: "2026-02-19", merchant: "AWS", amount: 143.00, currency: "USD", category: "Software" },
  { id: 5, date: "2026-02-25", merchant: "Singapore Taxi", amount: 32.00, currency: "SGD", category: "Travel" },
  { id: 6, date: "2026-03-02", merchant: "Figma", amount: 15.00, currency: "USD", category: "Software" },
  { id: 7, date: "2026-03-07", merchant: "Boulangerie Utopie", amount: 9.80, currency: "EUR", category: "Food" },
  { id: 8, date: "2026-03-11", merchant: "JR Rail Pass", amount: 50000, currency: "JPY", category: "Travel" },
  { id: 9, date: "2026-03-15", merchant: "Netflix", amount: 15.49, currency: "USD", category: "Entertainment" },
  { id: 10, date: "2026-03-20", merchant: "Swiggy", amount: 620, currency: "INR", category: "Food" },
  { id: 11, date: "2026-03-28", merchant: "Air Canada", amount: 410.00, currency: "CAD", category: "Travel" },
  { id: 12, date: "2026-04-02", merchant: "GitHub Copilot", amount: 10.00, currency: "USD", category: "Software" },
  { id: 13, date: "2026-04-08", merchant: "Burj Khalifa tickets", amount: 149.00, currency: "AED", category: "Entertainment" },
  { id: 14, date: "2026-04-12", merchant: "Qantas", amount: 520.00, currency: "AUD", category: "Travel" },
  { id: 15, date: "2026-04-15", merchant: "Linear", amount: 8.00, currency: "USD", category: "Software" },
  { id: 16, date: "2026-04-18", merchant: "Tacos el Califa", amount: 180, currency: "MXN", category: "Food" },
  { id: 17, date: "2026-04-22", merchant: "Spotify", amount: 10.99, currency: "USD", category: "Entertainment" },
  { id: 18, date: "2026-04-25", merchant: "Zoom", amount: 15.99, currency: "USD", category: "Software" },
  { id: 19, date: "2026-04-29", merchant: "Lune Croissanterie", amount: 22.00, currency: "AUD", category: "Food" },
  { id: 20, date: "2026-05-01", merchant: "Emirates flight", amount: 1850, currency: "AED", category: "Travel" },
];

const state = {
  expenses: [...INITIAL_EXPENSES],
  rates: { ...BASE_RATES },
  activeCategory: null,
  sortBy: "date",
  sortDirection: "asc",
  eurRate: BASE_RATES.EUR,
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const CATEGORY_COLORS = {
  Travel: "#18b56f",
  Software: "#168a9b",
  Food: "#c4d82d",
  Entertainment: "#39d98a",
};

const els = {
  overallTotal: document.querySelector("#overallTotal"),
  categoryBody: document.querySelector("#categoryBody"),
  merchantList: document.querySelector("#merchantList"),
  categoryPie: document.querySelector("#categoryPie"),
  pieLegend: document.querySelector("#pieLegend"),
  expenseBody: document.querySelector("#expenseBody"),
  activeFilterLabel: document.querySelector("#activeFilterLabel"),
  categoryFilter: document.querySelector("#categoryFilter"),
  emptyState: document.querySelector("#emptyState"),
  currencySelect: document.querySelector("#currencySelect"),
  expenseForm: document.querySelector("#expenseForm"),
  formError: document.querySelector("#formError"),
  rateForm: document.querySelector("#rateForm"),
  rateFormError: document.querySelector("#rateFormError"),
  supportedCurrencies: document.querySelector("#supportedCurrencies"),
  eurRate: document.querySelector("#eurRate"),
  eurRateValue: document.querySelector("#eurRateValue"),
  rateDelta: document.querySelector("#rateDelta"),
  resetRate: document.querySelector("#resetRate"),
};

function activeRates() {
  return { ...state.rates, EUR: Number(state.eurRate) };
}

function toUsd(expense, rates = activeRates()) {
  const rate = rates[expense.currency];
  if (!Number.isFinite(rate) || rate <= 0) {
    return null;
  }
  return expense.amount / rate;
}

function roundUsd(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function expensesWithUsd(rates = activeRates()) {
  return state.expenses.map((expense) => ({
    ...expense,
    usd: toUsd(expense, rates),
  }));
}

function getSummary(rows) {
  const byCategory = new Map();
  const byMerchant = new Map();
  let total = 0;

  rows.forEach((row) => {
    if (row.usd === null) return;
    total += row.usd;

    const category = byCategory.get(row.category) || {
      category: row.category,
      count: 0,
      total: 0,
      largest: row,
    };
    category.count += 1;
    category.total += row.usd;
    if (row.usd > category.largest.usd) category.largest = row;
    byCategory.set(row.category, category);

    byMerchant.set(row.merchant, (byMerchant.get(row.merchant) || 0) + row.usd);
  });

  return {
    total,
    categories: [...byCategory.values()].sort((a, b) => b.total - a.total),
    merchants: [...byMerchant.entries()]
      .map(([merchant, total]) => ({ merchant, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3),
  };
}

function formatOriginal(row) {
  return `${number.format(row.amount)} ${row.currency}`;
}

function categoryClass(category) {
  return `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function renderPieChart(categories) {
  const total = categories.reduce((sum, item) => sum + item.total, 0);
  let cursor = 0;
  const segments = categories.map((item) => {
    const start = cursor;
    const size = total > 0 ? (item.total / total) * 100 : 0;
    cursor += size;
    const color = CATEGORY_COLORS[item.category] || "#98a2b3";
    return `${color} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;
  });

  els.categoryPie.style.background = `conic-gradient(${segments.join(", ")})`;
  els.pieLegend.innerHTML = categories
    .map((item) => {
      const color = CATEGORY_COLORS[item.category] || "#98a2b3";
      const percent = total > 0 ? Math.round((item.total / total) * 100) : 0;
      return `
        <div class="legend-item">
          <span class="legend-dot" style="background:${color}"></span>
          <span>${item.category}</span>
          <span class="legend-value">${percent}%</span>
        </div>
      `;
    })
    .join("");
}

function renderSummary(rows) {
  const summary = getSummary(rows);
  els.overallTotal.textContent = money.format(roundUsd(summary.total));
  els.activeFilterLabel.textContent = state.activeCategory || "All categories";
  renderPieChart(summary.categories);

  els.categoryBody.innerHTML = summary.categories
    .map((item) => {
      const active = state.activeCategory === item.category ? " active" : "";
      return `
        <tr>
          <td><button class="category-button ${categoryClass(item.category)}${active}" type="button" data-category="${item.category}">${item.category}</button></td>
          <td class="count">${item.count}</td>
          <td class="money">${money.format(roundUsd(item.total))}</td>
          <td>${item.largest.merchant}</td>
          <td class="money">${money.format(roundUsd(item.largest.usd))}</td>
        </tr>
      `;
    })
    .join("");

  els.merchantList.innerHTML = summary.merchants
    .map((item) => `<li><span>${item.merchant}</span><strong>${money.format(roundUsd(item.total))}</strong></li>`)
    .join("");
}

function sortedFilteredRows(rows) {
  const filtered = state.activeCategory ? rows.filter((row) => row.category === state.activeCategory) : rows;
  return [...filtered].sort((a, b) => {
    const direction = state.sortDirection === "asc" ? 1 : -1;
    if (state.sortBy === "date") return a.date.localeCompare(b.date) * direction;
    return ((a.usd || 0) - (b.usd || 0)) * direction;
  });
}

function renderExpenses(rows) {
  const visibleRows = sortedFilteredRows(rows);
  els.emptyState.hidden = visibleRows.length !== 0;
  els.expenseBody.innerHTML = visibleRows
    .map((row) => `
      <tr>
        <td>${row.date}</td>
        <td>${escapeHtml(row.merchant)}</td>
        <td>${formatOriginal(row)}</td>
        <td><span class="category-badge ${categoryClass(row.category)}">${row.category}</span></td>
        <td class="money">${row.usd === null ? "Missing rate" : money.format(roundUsd(row.usd))}</td>
      </tr>
    `)
    .join("");
}

function renderRateNote() {
  els.eurRateValue.textContent = Number(state.eurRate).toFixed(4);
  const baseTotal = getSummary(expensesWithUsd(BASE_RATES)).total;
  const currentTotal = getSummary(expensesWithUsd()).total;
  const delta = roundUsd(currentTotal - baseTotal);
  const sign = delta > 0 ? "+" : "";
  els.rateDelta.textContent = `Total change vs base rate: ${sign}${money.format(delta)}`;
}

function renderSortButtons() {
  document.querySelectorAll("[data-sort]").forEach((button) => {
    const label = button.dataset.sort === "date" ? "Sort date" : "Sort USD";
    button.textContent = state.sortBy === button.dataset.sort ? `${label} ${state.sortDirection === "asc" ? "up" : "down"}` : label;
    button.classList.toggle("active", state.sortBy === button.dataset.sort);
  });
}

function renderCurrencyOptions() {
  const selected = els.currencySelect.value;
  const currencies = Object.keys(state.rates).sort();
  els.currencySelect.innerHTML = currencies
    .map((currency) => `<option value="${currency}">${currency}</option>`)
    .join("");
  if (currencies.includes(selected)) {
    els.currencySelect.value = selected;
  }
  els.supportedCurrencies.textContent = currencies.join(", ");
}

function renderCategoryFilter() {
  const categories = [...new Set(state.expenses.map((expense) => expense.category))].sort();
  els.categoryFilter.innerHTML = [
    '<option value="">All categories</option>',
    ...categories.map((category) => `<option value="${category}">${category}</option>`),
  ].join("");
  els.categoryFilter.value = state.activeCategory || "";
}

function render() {
  const rows = expensesWithUsd();
  renderCurrencyOptions();
  renderCategoryFilter();
  renderSummary(rows);
  renderExpenses(rows);
  renderRateNote();
  renderSortButtons();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initializeForm() {
  els.expenseForm.elements.date.value = "2026-05-02";
}

function handleSubmit(event) {
  event.preventDefault();
  els.formError.textContent = "";
  const data = new FormData(els.expenseForm);
  const merchant = String(data.get("merchant")).trim();
  const amount = Number(data.get("amount"));
  const currency = String(data.get("currency"));
  const category = String(data.get("category"));
  const date = String(data.get("date"));

  if (!merchant || !date || !category || !currency || !Number.isFinite(amount) || amount < 0) {
    els.formError.textContent = "Enter a merchant, date, category, currency, and an non-negative amount.";
    return;
  }

  if (!Number.isFinite(state.rates[currency]) || state.rates[currency] <= 0) {
    els.formError.textContent = "This currency is not supported by the rate table.";
    return;
  }

  state.expenses.push({
    id: Math.max(...state.expenses.map((expense) => expense.id)) + 1,
    merchant,
    amount,
    currency,
    category,
    date,
  });
  els.expenseForm.reset();
  els.expenseForm.elements.date.value = date;
  render();
}

function handleRateSubmit(event) {
  event.preventDefault();
  els.rateFormError.textContent = "";
  const data = new FormData(els.rateForm);
  const currencyCode = String(data.get("currencyCode")).trim().toUpperCase();
  const currencyRate = Number(data.get("currencyRate"));

  if (!/^[A-Z]{3}$/.test(currencyCode)) {
    els.rateFormError.textContent = "Use a 3-letter currency code, such as CHF.";
    return;
  }

  if (!Number.isFinite(currencyRate) || currencyRate <= 0) {
    els.rateFormError.textContent = "Enter a positive rate quoted as local currency per 1 USD.";
    return;
  }

  state.rates[currencyCode] = currencyRate;
  els.rateForm.reset();
  render();
}

document.addEventListener("click", (event) => {
  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    const category = categoryButton.dataset.category;
    state.activeCategory = state.activeCategory === category ? null : category;
    render();
  }

  const sortButton = event.target.closest("[data-sort]");
  if (sortButton) {
    const sortBy = sortButton.dataset.sort;
    if (state.sortBy === sortBy) {
      state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
    } else {
      state.sortBy = sortBy;
      state.sortDirection = "asc";
    }
    render();
  }
});

els.categoryFilter.addEventListener("change", (event) => {
  state.activeCategory = event.target.value || null;
  render();
});

function syncEurRate(event) {
  state.eurRate = Number(event.target.value);
  render();
}

els.eurRate.addEventListener("input", syncEurRate);
els.eurRate.addEventListener("change", syncEurRate);

els.resetRate.addEventListener("click", () => {
  state.eurRate = BASE_RATES.EUR;
  els.eurRate.value = String(BASE_RATES.EUR);
  render();
});

els.expenseForm.addEventListener("submit", handleSubmit);
els.rateForm.addEventListener("submit", handleRateSubmit);

initializeForm();
render();
