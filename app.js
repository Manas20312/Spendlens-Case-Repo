const RATES = { USD:1, EUR:0.9201, GBP:0.7887, INR:83.47, JPY:153.82, AUD:1.5312, CAD:1.3641, SGD:1.3478, AED:3.6725, MXN:17.154 };
const EXPENSES = [
 { id:1, date:'2026-02-03', merchant:'Indigo Airlines', amount:8200, currency:'INR', category:'Travel' },
 { id:2, date:'2026-02-10', merchant:'Slack Pro', amount:12.50, currency:'USD', category:'Software' },
 { id:3, date:'2026-02-14', merchant:'Dishoom London', amount:68.40, currency:'GBP', category:'Food' },
 { id:4, date:'2026-02-19', merchant:'AWS', amount:143.00, currency:'USD', category:'Software' },
 { id:5, date:'2026-02-25', merchant:'Singapore Taxi', amount:32.00, currency:'SGD', category:'Travel' },
 { id:6, date:'2026-03-02', merchant:'Figma', amount:15.00, currency:'USD', category:'Software' },
 { id:7, date:'2026-03-07', merchant:'Boulangerie Utopie', amount:9.80, currency:'EUR', category:'Food' },
 { id:8, date:'2026-03-11', merchant:'JR Rail Pass', amount:50000, currency:'JPY', category:'Travel' },
 { id:9, date:'2026-03-15', merchant:'Netflix', amount:15.49, currency:'USD', category:'Entertainment' },
 { id:10, date:'2026-03-20', merchant:'Swiggy', amount:620, currency:'INR', category:'Food' },
 { id:11, date:'2026-03-28', merchant:'Air Canada', amount:410.00, currency:'CAD', category:'Travel' },
 { id:12, date:'2026-04-02', merchant:'GitHub Copilot', amount:10.00, currency:'USD', category:'Software' },
 { id:13, date:'2026-04-08', merchant:'Burj Khalifa tickets', amount:149.00, currency:'AED', category:'Entertainment' },
 { id:14, date:'2026-04-12', merchant:'Qantas', amount:520.00, currency:'AUD', category:'Travel' },
 { id:15, date:'2026-04-15', merchant:'Linear', amount:8.00, currency:'USD', category:'Software' },
 { id:16, date:'2026-04-18', merchant:'Tacos el Califa', amount:180, currency:'MXN', category:'Food' },
 { id:17, date:'2026-04-22', merchant:'Spotify', amount:10.99, currency:'USD', category:'Entertainment' },
 { id:18, date:'2026-04-25', merchant:'Zoom', amount:15.99, currency:'USD', category:'Software' },
 { id:19, date:'2026-04-29', merchant:'Lune Croissanterie', amount:22.00, currency:'AUD', category:'Food' },
 { id:20, date:'2026-05-01', merchant:'Emirates flight', amount:1850, currency:'AED', category:'Travel' },
];
const money = new Intl.NumberFormat('en-US', {style:'currency', currency:'USD'});
const toUsd = e => e.amount / RATES[e.currency];
const rows = EXPENSES.map(e => ({...e, usd: toUsd(e)}));
const categoryMap = new Map(); const merchantMap = new Map(); let total = 0;
for (const row of rows) { total += row.usd; const cat = categoryMap.get(row.category) || {category: row.category, count:0, total:0, largest: row}; cat.count += 1; cat.total += row.usd; if (row.usd > cat.largest.usd) cat.largest = row; categoryMap.set(row.category, cat); merchantMap.set(row.merchant, (merchantMap.get(row.merchant) || 0) + row.usd); }
document.querySelector('#overallTotal').textContent = money.format(total);
document.querySelector('#categoryBody').innerHTML = [...categoryMap.values()].sort((a,b)=>b.total-a.total).map(c => '<tr><td>'+c.category+'</td><td>'+c.count+'</td><td>'+money.format(c.total)+'</td><td>'+c.largest.merchant+'</td><td>'+money.format(c.largest.usd)+'</td></tr>').join('');
document.querySelector('#merchantList').innerHTML = [...merchantMap.entries()].sort((a,b)=>b[1]-a[1]).slice(0,3).map(([m,t]) => '<li><span>'+m+'</span><strong>'+money.format(t)+'</strong></li>').join('');
document.querySelector('#expenseBody').innerHTML = rows.map(r => '<tr><td>'+r.date+'</td><td>'+r.merchant+'</td><td>'+r.amount+' '+r.currency+'</td><td>'+r.category+'</td><td>'+money.format(r.usd)+'</td></tr>').join('');
