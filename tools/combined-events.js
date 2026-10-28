/* Combined events points calculator. Needs core.js.
   Points use the formulas and parameters published in the IAAF Scoring Tables
   for Combined Events (2001 edition, reprinted 2016), which World Athletics
   Technical Rule 39 refers to. Points are rounded down to a whole number. */
(function () {
  "use strict";
  var SB = window.SB, t = SB.t;

  // type: track (seconds), jump (centimetres), throw (metres).
  // hand: seconds added to a hand time before scoring (0.24 below 400 m, 0.14 at 400 m).
  var EVENTS = {
    m60:    { a: 58.015,   b: 11.5,  c: 1.81,  type: "track", hand: 0.24, en: "60 m", it: "60 m" },
    m100:   { a: 25.4347,  b: 18,    c: 1.81,  type: "track", hand: 0.24, en: "100 m", it: "100 m" },
    m400:   { a: 1.53775,  b: 82,    c: 1.81,  type: "track", hand: 0.14, en: "400 m", it: "400 m" },
    m1000:  { a: 0.08713,  b: 305.5, c: 1.85,  type: "track", hand: 0,    en: "1000 m", it: "1000 m" },
    m1500:  { a: 0.03768,  b: 480,   c: 1.85,  type: "track", hand: 0,    en: "1500 m", it: "1500 m" },
    m60H:   { a: 20.5173,  b: 15.5,  c: 1.92,  type: "track", hand: 0.24, en: "60 m hurdles", it: "60 m ostacoli" },
    m110H:  { a: 5.74352,  b: 28.5,  c: 1.92,  type: "track", hand: 0.24, en: "110 m hurdles", it: "110 m ostacoli" },
    mHJ:    { a: 0.8465,   b: 75,    c: 1.42,  type: "jump",  en: "High jump", it: "Salto in alto" },
    mPV:    { a: 0.2797,   b: 100,   c: 1.35,  type: "jump",  en: "Pole vault", it: "Salto con l’asta" },
    mLJ:    { a: 0.14354,  b: 220,   c: 1.4,   type: "jump",  en: "Long jump", it: "Salto in lungo" },
    mSP:    { a: 51.39,    b: 1.5,   c: 1.05,  type: "throw", en: "Shot put", it: "Getto del peso" },
    mDT:    { a: 12.91,    b: 4,     c: 1.1,   type: "throw", en: "Discus", it: "Lancio del disco" },
    mJT:    { a: 10.14,    b: 7,     c: 1.08,  type: "throw", en: "Javelin", it: "Lancio del giavellotto" },
    w100:   { a: 17.857,   b: 21,    c: 1.81,  type: "track", hand: 0.24, en: "100 m", it: "100 m" },
    w200:   { a: 4.99087,  b: 42.5,  c: 1.81,  type: "track", hand: 0.24, en: "200 m", it: "200 m" },
    w400:   { a: 1.34285,  b: 91.7,  c: 1.81,  type: "track", hand: 0.14, en: "400 m", it: "400 m" },
    w800:   { a: 0.11193,  b: 254,   c: 1.88,  type: "track", hand: 0,    en: "800 m", it: "800 m" },
    w1500:  { a: 0.02883,  b: 535,   c: 1.88,  type: "track", hand: 0,    en: "1500 m", it: "1500 m" },
    w60H:   { a: 20.0479,  b: 17,    c: 1.835, type: "track", hand: 0.24, en: "60 m hurdles", it: "60 m ostacoli" },
    w100H:  { a: 9.23076,  b: 26.7,  c: 1.835, type: "track", hand: 0.24, en: "100 m hurdles", it: "100 m ostacoli" },
    wHJ:    { a: 1.84523,  b: 75,    c: 1.348, type: "jump",  en: "High jump", it: "Salto in alto" },
    wPV:    { a: 0.44125,  b: 100,   c: 1.35,  type: "jump",  en: "Pole vault", it: "Salto con l’asta" },
    wLJ:    { a: 0.188807, b: 210,   c: 1.41,  type: "jump",  en: "Long jump", it: "Salto in lungo" },
    wSP:    { a: 56.0211,  b: 1.5,   c: 1.05,  type: "throw", en: "Shot put", it: "Getto del peso" },
    wDT:    { a: 12.3311,  b: 3,     c: 1.1,   type: "throw", en: "Discus", it: "Lancio del disco" },
    wJT:    { a: 15.9803,  b: 3.8,   c: 1.04,  type: "throw", en: "Javelin", it: "Lancio del giavellotto" }
  };

  // Events in the order they are held (World Athletics Technical Rule 39 and the short track rules).
  var COMPETITIONS = {
    decathlon:  ["m100", "mLJ", "mSP", "mHJ", "m400", "m110H", "mDT", "mPV", "mJT", "m1500"],
    heptathlon: ["w100H", "wHJ", "wSP", "w200", "wLJ", "wJT", "w800"],
    indoorHeptathlon: ["m60", "mLJ", "mSP", "mHJ", "m60H", "mPV", "m1000"],
    indoorPentathlon: ["w60H", "wHJ", "wSP", "wLJ", "w800"],
    womensDecathlon: ["w100", "wDT", "wPV", "wJT", "w400", "w100H", "wLJ", "wSP", "wHJ", "w1500"]
  };

  function label(key) { return t(EVENTS[key].en, EVENTS[key].it); }

  var PLACEHOLDER = { m60: "7.10", m100: "11.00", m400: "50.00", m1000: "2:50.00", m1500: "4:40.00", m60H: "8.40", m110H: "15.00",
    w100: "12.50", w200: "25.00", w400: "58.00", w800: "2:20.00", w1500: "5:10.00", w60H: "8.80", w100H: "14.00",
    mHJ: "1.90", mPV: "4.50", mLJ: "7.00", mSP: "13.50", mDT: "40.00", mJT: "55.00",
    wHJ: "1.70", wPV: "3.50", wLJ: "6.00", wSP: "13.00", wDT: "35.00", wJT: "42.00" };
  function placeholder(key) {
    var v = PLACEHOLDER[key];
    return EVENTS[key].type === "track" ? v : t(v, v.replace(".", ","));
  }

  // Raw performance as the formula wants it: seconds, centimetres or metres. Null if unreadable.
  function readMark(key, text) {
    var e = EVENTS[key];
    if (text == null || String(text).trim() === "") return null;
    if (e.type === "track") return SB.parseTime(text);
    var m = parseFloat(String(text).trim().replace(",", ".").replace(/m$/i, ""));
    if (!isFinite(m) || m <= 0) return null;
    return e.type === "jump" ? Math.round(m * 100) : m;
  }

  function points(key, perf, hand) {
    var e = EVENTS[key];
    var x;
    if (e.type === "track") x = e.b - (perf + (hand ? e.hand : 0));
    else x = perf - e.b;
    if (!(x > 0)) return 0;
    return Math.floor(e.a * Math.pow(x, e.c) + 1e-9);
  }

  // The weakest mark that still scores at least p points.
  function markFor(key, p, hand) {
    var e = EVENTS[key];
    if (p <= 0) return null;
    var d = Math.pow(p / e.a, 1 / e.c);
    var step, v;
    if (e.type === "track") {
      step = hand ? 0.1 : 0.01;
      v = e.b - d - (hand ? e.hand : 0);
      v = Math.floor(v / step + 1e-9) * step;
      while (v > 0 && points(key, v, hand) < p) v -= step;
      return v > 0 ? v : null;
    }
    step = e.type === "jump" ? 1 : 0.01;
    v = Math.ceil((e.b + d) / step - 1e-9) * step;
    while (points(key, v, hand) < p) v += step;
    return v;
  }

  function formatMark(key, v, hand) {
    var e = EVENTS[key];
    if (v == null) return "–";
    if (e.type === "track") return SB.formatTime(v, hand ? 1 : 2);
    return SB.formatNum(e.type === "jump" ? v / 100 : v, 2) + " m";
  }

  function compute(state) {
    var keys = COMPETITIONS[state.comp] || COMPETITIONS.decathlon;
    var hand = state.timing === "hand";
    var total = 0, scored = 0, bad = [];
    var rows = keys.map(function (key) {
      var text = state.marks[key];
      var perf = readMark(key, text);
      if (text != null && String(text).trim() !== "" && perf == null) bad.push(key);
      var p = perf == null ? null : points(key, perf, hand);
      if (p != null) { total += p; scored++; }
      return { key: key, perf: perf, points: p, total: p == null ? null : total };
    });
    var target = state.target > 0 ? Math.round(state.target) : null;
    var remaining = keys.length - scored;
    var needed = target ? target - total : null;
    var each = target && remaining ? Math.ceil(Math.max(needed, 0) / remaining) : null;
    if (each != null) rows.forEach(function (r) { if (r.perf == null) r.needed = markFor(r.key, each, hand); });
    return { rows: rows, hand: hand, total: total, scored: scored, count: keys.length, target: target, needed: needed, each: each, remaining: remaining, bad: bad };
  }

  // Pure: the results markup. Also used to write the page's static example.
  function view(res) {
    var html = '<div class="stats">' +
      stat(t("Total", "Totale"), SB.formatNum(res.total), res.scored + t(" of ", " su ") + res.count + t(" events scored", " prove con un punteggio"), true);
    if (res.target && res.remaining && res.needed > 0) {
      html += stat(t("Still needed", "Mancano"), SB.formatNum(res.needed), t("points for ", "punti per ") + SB.formatNum(res.target)) +
        stat(t("Per event left", "Per prova rimasta"), SB.formatNum(res.each), t("points on average", "punti in media"));
    } else if (res.target) {
      var diff = res.total - res.target;
      html += stat(t("Against target", "Rispetto all’obiettivo"), (diff >= 0 ? "+" : "−") + SB.formatNum(Math.abs(diff)), t("points", "punti"));
    } else if (res.scored) {
      html += stat(t("Average", "Media"), SB.formatNum(Math.round(res.total / res.scored)), t("points per event", "punti per prova"));
    }
    html += "</div>";

    var showNeeded = res.each != null && res.needed > 0;
    html += '<div class="table-wrap"><table><thead><tr><th>' + t("Event", "Prova") + "</th><th>" + t("Mark", "Prestazione") + "</th><th>" + t("Points", "Punti") + "</th><th>" + t("Total", "Totale") + "</th>" +
      (showNeeded ? "<th>" + t("For target", "Per l’obiettivo") + "</th>" : "") + "</tr></thead><tbody>";
    res.rows.forEach(function (r) {
      html += "<tr><td>" + label(r.key) + "</td>" +
        "<td>" + (r.perf == null ? "–" : formatMark(r.key, r.perf, res.hand)) + "</td>" +
        '<td class="hl">' + (r.points == null ? "–" : SB.formatNum(r.points)) + "</td>" +
        "<td>" + (r.total == null ? "–" : SB.formatNum(r.total)) + "</td>" +
        (showNeeded ? "<td>" + (r.perf == null ? formatMark(r.key, r.needed, res.hand) : "") + "</td>" : "") + "</tr>";
    });
    html += "</tbody></table></div>";
    if (showNeeded) {
      html += '<p class="note">' + t("For target: the mark that scores ", "Per l’obiettivo: la prestazione che vale ") + SB.formatNum(res.each) +
        t(" points in each event left. Any mix of marks with the same total works.", " punti in ogni prova rimasta. Va bene qualsiasi combinazione con lo stesso totale.") + "</p>";
    }
    if (res.hand) html += '<p class="note">' + t("Hand times: 0.24 s is added below 400 m and 0.14 s at 400 m before scoring.", "Tempi manuali: prima del calcolo si aggiungono 0,24 s sotto i 400 m e 0,14 s sui 400 m.") + "</p>";
    if (res.bad.length) html += '<p class="warn">' + t("Could not read the mark for: ", "Prestazione non leggibile per: ") + res.bad.map(label).join(", ") + "</p>";
    return html;
  }

  function stat(k, v, s, hero) {
    return '<div class="stat' + (hero ? " hero" : "") + '"><span class="k">' + k + '</span><output class="v">' + v + '</output><div class="s">' + s + "</div></div>";
  }

  // Pure: the per-event inputs for a competition.
  function fields(comp, marks) {
    return COMPETITIONS[comp].map(function (key) {
      var id = "ce-" + key;
      return '<div class="field"><label for="' + id + '">' + label(key) + "</label>" +
        '<input type="text" id="' + id + '" name="' + key + '" inputmode="decimal" placeholder="' + placeholder(key) + '" value="' + SB.esc(marks[key] || "") + '"></div>';
    }).join("");
  }

  var marks = {};
  var shown = null;

  function render() {
    var form = SB.$("#ce-form");
    var comp = form.elements.comp.value;
    var box = SB.$("#ce-events");
    if (comp !== shown) {
      if (shown === null) {
        SB.$all("input", box).forEach(function (el) { if (el.value) marks[el.name] = el.value; });
      }
      shown = comp;
      box.innerHTML = fields(comp, marks);
    }
    SB.$all("input", box).forEach(function (el) { marks[el.name] = el.value; });
    var target = parseInt(String(form.elements.target.value).replace(/[^\d]/g, ""), 10);
    var res = compute({ comp: comp, timing: form.elements.timing.value, marks: marks, target: target });
    SB.$all("input", box).forEach(function (el) { SB.invalid(el, res.bad.indexOf(el.name) >= 0); });
    SB.$("#ce-results").innerHTML = view(res);
  }

  SB.combinedEvents = { EVENTS: EVENTS, COMPETITIONS: COMPETITIONS, points: points, markFor: markFor, compute: compute, view: view, fields: fields };
  if (document.getElementById && document.getElementById("ce-form")) SB.bind("#ce-form", render);
})();
