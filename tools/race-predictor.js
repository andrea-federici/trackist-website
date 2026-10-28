/* Race time predictor (Riegel formula). Needs core.js. */
(function () {
  "use strict";
  var SB = window.SB, t = SB.t;

  var EVENTS = [60, 100, 200, 400, 800, 1000, 1500, SB.MILE, 3000, 5000, 10000];
  var MAX_RATIO = 4;      // further than 4× from the nearest PB is flagged
  var SPRINT_BELOW = 400; // the formula was not fitted to sprints

  function riegel(t1, d1, d2, k) { return t1 * Math.pow(d2 / d1, k); }

  function fitExponent(a, b) {
    if (!a || !b || a.dist === b.dist) return null;
    return Math.log(b.time / a.time) / Math.log(b.dist / a.dist);
  }

  // pbs: one or two { dist, time }. k: exponent, ignored when two PBs are given.
  function compute(pbs, k) {
    pbs = pbs.filter(Boolean);
    if (!pbs.length) return null;
    var fitted = pbs.length === 2;
    if (fitted) k = fitExponent(pbs[0], pbs[1]);
    if (k == null || !isFinite(k)) return null;
    var anchor = pbs[0];
    var rows = EVENTS.map(function (d) {
      var nearest = pbs.reduce(function (best, p) {
        var r = Math.max(d / p.dist, p.dist / d);
        return r < best ? r : best;
      }, Infinity);
      var own = pbs.filter(function (p) { return Math.abs(p.dist - d) < 0.5; })[0];
      var time = own ? own.time : riegel(anchor.time, anchor.dist, d, k);
      var flag = own ? "pb" : (d < SPRINT_BELOW || pbs.some(function (p) { return p.dist < SPRINT_BELOW; })) ? "sprint" : (nearest > MAX_RATIO ? "far" : "");
      return { dist: d, time: time, per400: time / d * 400, perKm: time / d * 1000, flag: flag };
    });
    return { k: k, fitted: fitted, pbs: pbs, rows: rows, slowdown: (Math.pow(2, k - 1) - 1) * 100 };
  }

  function eventName(d) {
    if (Math.abs(d - SB.MILE) < 0.5) return t("Mile", "Miglio");
    // Track events are written 1500 m, not 1,500 m; only 10,000 m takes a separator.
    return (d >= 10000 ? SB.formatNum(d) : String(d)) + " m";
  }

  function stat(k, v, s, hero) {
    return '<div class="stat' + (hero ? " hero" : "") + '"><span class="k">' + k + '</span><output class="v">' + v + '</output><div class="s">' + s + "</div></div>";
  }

  // Pure: the results markup. Also used to write the page's static example.
  function view(res) {
    if (!res) return '<p class="error">' + t("Enter a PB time, like 4:10.00 for 1500 m.", "Inserisci il tempo di un primato, per esempio 4:10.00 sui 1500 m.") + "</p>";
    var html = '<div class="stats">' +
      stat(res.fitted ? t("Your exponent", "Il tuo esponente") : t("Exponent", "Esponente"), SB.formatNum(res.k, 3),
        res.fitted ? t("fitted from your two PBs", "calcolato dai tuoi due primati") : t("1.06 is Riegel's value", "1,06 è il valore di Riegel"), true) +
      stat(t("Slow-down", "Rallentamento"), "+" + SB.formatNum(res.slowdown, 1) + "%", t("pace each time the distance doubles", "di passo ogni volta che la distanza raddoppia")) +
      "</div>";
    if (res.fitted && (res.k < 1.0 || res.k > 1.2)) {
      html += '<p class="warn">' + t("This exponent is far from Riegel's 1.06. Check that both PBs are recent and correct.",
        "Questo esponente è molto lontano dall’1,06 di Riegel. Controlla che i due primati siano recenti e corretti.") + "</p>";
    }
    html += '<div class="table-wrap"><table><thead><tr><th>' + t("Event", "Gara") + "</th><th>" + t("Time", "Tempo") + "</th><th>/400 m</th><th>/km</th><th>" + t("Note", "Nota") + "</th></tr></thead><tbody>";
    var flagged = false;
    res.rows.forEach(function (r) {
      var note = r.flag === "pb" ? t("Your PB", "Il tuo primato") : r.flag === "sprint" ? t("Rough: sprint", "Indicativo: velocità") : r.flag === "far" ? t("Rough: far from PB", "Indicativo: lontano dal primato") : "";
      if (r.flag === "sprint" || r.flag === "far") flagged = true;
      var cls = r.flag === "pb" ? ' class="hl"' : "";
      html += "<tr><td" + cls + ">" + eventName(r.dist) + "</td><td" + cls + ">" + SB.formatTime(r.time) + "</td><td>" + SB.formatTime(r.per400, 1) + "</td><td>" + SB.formatTime(r.perKm, 0) + "</td><td>" + note + "</td></tr>";
    });
    html += "</tbody></table></div>";
    if (flagged) {
      html += '<p class="note">' + t("Rough means the formula is outside the range where it works well: below 400 m, or more than 4 times longer or shorter than your PB.",
        "Indicativo vuol dire che la formula è fuori dal campo in cui funziona bene: sotto i 400 m, o a più di 4 volte la distanza del tuo primato, in più o in meno.") + "</p>";
    }
    return html;
  }

  function readPb(form, ev, tm) {
    var d = parseFloat(form.elements[ev].value);
    var raw = form.elements[tm].value;
    var s = SB.parseTime(raw);
    SB.invalid(form.elements[tm], raw.trim() !== "" && !s);
    return d && s ? { dist: d, time: s } : null;
  }

  function render() {
    var form = SB.$("#pred-form");
    var two = form.elements.mode.value === "two";
    SB.$("#second-pb").hidden = !two;
    SB.$("#exponent-field").hidden = two;
    var pbs = [readPb(form, "pbEvent", "pbTime")];
    var kRaw = form.elements.k.value.replace(",", ".");
    var k = parseFloat(kRaw);
    var kBad = !(k >= 0.9 && k <= 1.3);
    SB.invalid(form.elements.k, !two && kBad);
    if (two) {
      pbs.push(readPb(form, "pbEvent2", "pbTime2"));
      if (!pbs[0] || !pbs[1] || pbs[0].dist === pbs[1].dist) {
        SB.$("#pred-results").innerHTML = '<p class="error">' + t("Enter two PBs at different distances.", "Inserisci due primati su distanze diverse.") + "</p>";
        return;
      }
    } else if (kBad) {
      SB.$("#pred-results").innerHTML = '<p class="error">' + t("Use an exponent between 0.9 and 1.3.", "Usa un esponente tra 0,9 e 1,3.") + "</p>";
      return;
    }
    SB.$("#pred-results").innerHTML = view(compute(pbs, k));
  }

  SB.racePredictor = { riegel: riegel, fitExponent: fitExponent, compute: compute, view: view };
  if (document.getElementById && document.getElementById("pred-form")) SB.bind("#pred-form", render);
})();
