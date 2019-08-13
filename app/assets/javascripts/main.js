// let useCR = false;
//
// const characters = [];
// const monsters = [];
// const xp = {
//   easy: 0,
//   medium: 0,
//   hard: 0,
//   deadly: 0,
// };
// const xpLookup = [
//   [
//     25, 50, 75, 100,
//   ],
//   [
//     50, 100, 150, 200,
//   ],
//   [
//     75, 150, 225, 400,
//   ],
//   [
//     125, 250, 375, 500,
//   ],
//   [
//     250, 500, 750, 1100,
//   ],
//   [
//     300, 600, 900, 1400,
//   ],
//   [
//     350, 750, 1100, 1700,
//   ],
//   [
//     450, 900, 1400, 2100,
//   ],
//   [
//     550, 1100, 1600, 2400,
//   ],
//   [
//     600, 1200, 1900, 2800,
//   ],
//   [
//     800, 1600, 2400, 3600,
//   ],
//   [
//     1000, 2000, 3000, 4500,
//   ],
//   [
//     1100, 2200, 3400, 5100,
//   ],
//   [
//     1250, 2500, 3800, 5700,
//   ],
//   [
//     1400, 2800, 4300, 6400,
//   ],
//   [
//     1600, 3200, 4800, 7200,
//   ],
//   [
//     2000, 3900, 5900, 8800,
//   ],
//   [
//     2100, 4200, 6300, 9500,
//   ],
//   [
//     2400, 4900, 7300, 10900,
//   ],
//   [
//     2800, 5700, 8500, 12700,
//   ],
// ];
// const groupCats = [
//   'none',
//   'single',
//   'pair',
//   'group',
//   'gang',
//   'mob',
//   'horde',
// ];
// const multiplierLookup = [
//   0.5,
//   1,
//   1.5,
//   2,
//   2.5,
//   3,
//   4,
//   5,
// ];
// const crLookup = [
//   '0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5',
//   '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
//   '16', '17', '18', '19', '20', '21', '22', '23', '24', '25',
//   '26', '27', '28', '29', '30',
// ];
// const crXPLookup = [
//   25,
//   50,
//   100,
//   200,
//   450,
//   700,
//   1100,
//   1800,
//   2300,
//   2900,
//   3900,
//   5000,
//   5900,
//   7200,
//   8400,
//   10000,
//   11500,
//   13000,
//   15000,
//   18000,
//   20000,
//   22000,
//   25000,
//   33000,
//   41000,
//   50000,
//   62000,
//   75000,
//   90000,
//   105000,
//   120000,
//   135000,
//   155000,
// ];
//
// document.getElementById('instructionsToggle').onclick = function () {
//   toggleInstructions();
// };
// function toggleInstructions () {
//   if (document.getElementById('instructions').className == 'hidden') {
//     document.getElementById('instructions').className = '';
//   } else {
//     document.getElementById('instructions').className = 'hidden';
//   }
// }
// document.getElementById('tipsToggle').onclick = function () {
//   toggleTips();
// };
// function toggleTips () {
//   if (document.getElementById('tips').className == 'hidden') {
//     document.getElementById('tips').className = '';
//   } else {
//     document.getElementById('tips').className = 'hidden';
//   }
// }
//
// function countInputRows (selector) {
//   return document.getElementById(selector).children.length;
// }
//
// function addInputRow (selector) {
//   const num = countInputRows(selector) + 1;
//
//   const container = document.createElement('div');
//   container.className = `${selector}inputRow`;
//   container.id = `${selector}inputRow${num}`;
//   document.getElementById(selector).appendChild(container);
//
//   const number = document.createElement('input');
//   number.id = `${selector}number${num}`;
//   number.placeholder = `Number of ${selector}`;
//   container.appendChild(number);
//
//   const level = document.createElement('input');
//   level.id = `${selector}level${num}`;
//   if (selector == 'characters') {
//     level.placeholder = 'Character level';
//   }
//   if (selector == 'monsters') {
//     level.placeholder = useCR ? 'Monster CR' : 'Monster XP';
//   }
//   container.appendChild(level);
//
//   window[selector].push([]);
// }
//
// function removeInputRow (selector) {
//   window[selector].pop();
//   const rows = document.getElementById(selector).children;
//   document.getElementById(selector).removeChild(rows[rows.length - 1]);
// }
//
// function getFromInputs (selector) {
//   const inputRows = countInputRows(selector);
//
//   for (let i = 0; i < inputRows; i++) {
//     const j = i + 1;
//     window[selector][i][0] = document.getElementById(`${selector}number${j}`).value;
//     window[selector][i][1] = document.getElementById(`${selector}level${j}`).value;
//   }
// }
//
// function calculate () {
//   let results = '';
//   let easyXP = 0,
//     mediumXP = 0,
//     hardXP = 0,
//     deadlyXP = 0;
//
//   getFromInputs('characters');
//
//   for (const group in characters) {
//     if (characters[group]) {
//       const number = characters[group][0];
//       const level = characters[group][1];
//       const l = level - 1;
//       if (l >= 0 && number > 0) {
//         easyXP += xpLookup[l][0] * number;
//         mediumXP += xpLookup[l][1] * number;
//         hardXP += xpLookup[l][2] * number;
//         deadlyXP += xpLookup[l][3] * number;
//       }
//     }
//   }
//
//   xp.easy = easyXP;
//   xp.medium = mediumXP;
//   xp.hard = hardXP;
//   xp.deadly = deadlyXP;
//
//   results += `<p>Easy: <span id='easyXP'>${easyXP}</span> XP</p>`;
//   results += `<p>Medium: <span id='mediumXP'>${mediumXP}</span> XP</p>`;
//   results += `<p>Hard: <span id='hardXP'>${hardXP}</span> XP</p>`;
//   results += `<p>Deadly: <span id='deadlyXP'>${deadlyXP}</span> XP</p>`;
//
//   document.getElementById('results').innerHTML = results;
//   // if (document.getElementById("monsterCalculate").disabled) document.getElementById("monsterCalculate").disabled = false;
//
//   ga('send', 'event', 'Encounter Calculator', 'Calculate', `Use CR = ${useCR}`);
// }
//
// function monsterCalculate () {
//   if (!xp) {
//     calculate();
//   }
//
//   let results = '';
//   let totalXP = 0;
//   var cr = 0;
//   getFromInputs('monsters');
//
//   for (var group in monsters) {
//     if (monsters[group]) {
//       const number = monsters[group][0];
//       var xp = useCR ? xpFromCR(monsters[group][1]) : monsters[group][1];
//       totalXP += number * xp;
//     }
//   }
//   let monsterTotal = 0;
//   for (var group in monsters) {
//     monsterTotal += parseInt(monsters[group][0]);
//   }
//   let characterTotal = 0;
//   for (var group in characters) {
//     characterTotal += parseInt(characters[group][0]);
//   }
//   let multiplier = 0;
//   if (monsterTotal > 0) {
//     multiplier++;
//   }
//   if (monsterTotal > 1) {
//     multiplier++;
//   }
//   if (monsterTotal > 2) {
//     multiplier++;
//   }
//   if (monsterTotal > 6) {
//     multiplier++;
//   }
//   if (monsterTotal > 10) {
//     multiplier++;
//   }
//   if (monsterTotal > 14) {
//     multiplier++;
//   }
//
//   const groupCategory = groupCats[multiplier];
//   let partySize = '';
//
//   if (!characterTotal >= 1) {
//     multiplier++;
//     partySize = ' (none)';
//   } else if (characterTotal >= 1 && characterTotal < 3) {
//     multiplier++;
//     partySize = ' (small party)';
//   } else if (characterTotal >= 6) {
//     multiplier--;
//     partySize = ' (large party)';
//   }
//
//   results += `<p>Characters: ${characterTotal}${partySize}</p>`;
//   results += `<p>Monsters: ${monsterTotal} (${groupCategory})</p>`;
//   results += `<p>XP to award: ${totalXP} XP${characterTotal ? ` (${totalXP / characterTotal} XP each)` : ''}</p>`;
//   results += `<p>Difficulty multiplier: ${multiplierLookup[multiplier]}</p>`;
//   results += `<p>Adjusted Difficulty Rating: ${totalXP * multiplierLookup[multiplier]} XP</p>`;
//
//   var cr = getCR(totalXP * multiplierLookup[multiplier]);
//   results += `<p>Encounter Challenge Rating: ${cr}</p>`;
//
//   document.getElementById('monsterResults').innerHTML = results;
//
//   comparison(totalXP * multiplierLookup[multiplier], characterTotal);
//
//   ga('send', 'event', 'Encounter Calculator', 'Monster Calculate', `Use CR = ${useCR}`);
// }
//
// function comparison (encounter, characterTotal) {
//   let c = '';
//   if (characterTotal > 0) {
//     if (encounter < xp.easy) {
//       c = '<p class=\'trivial\'>Trivial</p>';
//     } else if (encounter < xp.medium) {
//       c = '<p class=\'easy\'>Easy</p>';
//     } else if (encounter < xp.hard) {
//       c = '<p class=\'medium\'>Medium</p>';
//     } else if (encounter < xp.deadly) {
//       c = '<p class=\'hard\'>Hard</p>';
//     } else {
//       c = '<p class=\'deadly\'>Deadly</p>';
//     }
//   } else {
//     c = '<p class=\'na\'>Not Applicable</p>';
//   }
//
//   document.getElementById('comparison').innerHTML = c;
// }
//
// function xpFromCR (input) {
//   let output = 0;
//   const n = input.split('/');
//   if (n.length > 1) {
//     var cr = n[0] / n[1];
//     if (cr <= 0) {
//       output = 0;
//     } else if (cr <= 1 / 8) {
//       output = crXPLookup[0];
//     } else if (cr <= 1 / 4) {
//       output = crXPLookup[1];
//     } else if (cr <= 1 / 2) {
//       output = crXPLookup[2];
//     }
//   } else {
//     var cr = parseInt(input);
//     if (cr > 0) {
//       output = crXPLookup[cr + 2];
//     }
//   }
//   if (typeof output === 'undefined') {
//     // error state goes here e.g. NaN
//     // do something sensible with this later
//     output = 0;
//   }
//   return output;
// }
// function getCR (xp) {
//   let cr = 0;
//   for (let i = 0; i < crXPLookup.length; i++) {
//     if (crXPLookup[i] <= xp) {
//       cr++;
//     }
//   }
//   return crLookup[cr];
// }
//
// function toggleCR () {
//   useCR = document.getElementById('useCR').checked;
//   const measure = useCR ? 'CR' : 'XP';
//   document.getElementById('monsterMeasure').innerHTML = measure;
//   const rows = countInputRows('monsters');
//   for (let i = 1; i <= rows; i++) {
//     document.getElementById(`monsterslevel${i}`).placeholder = `Monster ${measure}`;
//   }
//   localStorage.setItem('UseCR', useCR);
// }
//
// function init () {
//   document.getElementById('container').style.minHeight = window.innerHeight - document.getElementById('topBar').clientHeight - 1;
//   addInputRow('characters');
//   addInputRow('monsters');
//   if (document.getElementById('useCR').checked) {
//     document.getElementById('useCR').checked = false;
//   } // some browsers try to restore form state across refreshes
//
//   // load user preferences
//   const loadUseCR = JSON.parse(localStorage.getItem('UseCR'));
//   if (loadUseCR) {
//     document.getElementById('useCR').checked = 'checked';
//     toggleCR(true);
//   }
// }
