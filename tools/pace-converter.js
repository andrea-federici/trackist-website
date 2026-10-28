/* Pace and unit converter. Needs core.js. */
(function () {
  "use strict";
  var SB = window.SB, t = SB.t;
  var INCH = 0.0254; // exact, by the 1959 international yard

  // Each pace or speed field: how to read it as metres per second, and how to write it back.
  var FIELDS = {
    perKm:   { toMs: function (x) { var s = SB.parseTime(x); return s ? 1000 / s : null; }, fmt: function (v) { return SB.formatTime(1000 / v, 0); } },
    perMile: { toMs: function (x) { var s = SB.parseTime(x); return s ? SB.MILE / s : null; }, fmt: function (v) { return SB.formatTime(SB.MILE / v, 0); } },
    per400:  { toMs: function (x) { var s = SB.parseTime(x); return s ? 400 / s : null; }, fmt: function (v) { return SB.formatTime(400 / v, 1); } },
    per100:  { toMs: function (x) { var s = SB.parseTime(x); return s ? 100 / s : null; }, fmt: function (v) { return SB.formatTime(100 / v, 1); } },
    kmh:     { toMs: function (x) { var n = num(x); return n ? n / 3.6 : null; }, fmt: function (v) { return SB.formatNum(v * 3.6, 2); } },
    mph:     { toMs: function (x) { var n = num(x); return n ? n * SB.MILE / 3600 : null; }, fmt: function (v) { return SB.formatNum(v * 3600 / SB.MILE, 2); } },
    ms:      { toMs: function (x) { var n = num(x); return n ? n : null; }, fmt: function (v) { return SB.formatNum(v, 2); } }
  };

  var DISTANCES = [
    [100, "100 m"], [200, "200 m"], [400, "400 m"], [800, "800 m"], [1500, "1500 m"],
    [SB.MILE, t("Mile", "Miglio")], [5000, "5 km"], [10000, "10 km"],
    [21097.5, t("Half marathon", "Mezza maratona")], [42195, t("Marathon", "Maratona")]
  ];

  function num(x) {
    var s = String(x == null ? "" : x).trim().replace(/\s/g, "");
    // Accept 15,5 and 15.5; drop thousands separators only when both appear.
    if (s.indexOf(",") >= 0 && s.indexOf(".") >= 0) s = s.replace(/[.,](?=\d{3}\b)/g, "");
    s = s.replace(",", ".");
    if (!/^\d+(\.\d+)?$/.test(s)) return null;
    var n = parseFloat(s);
    return n > 0 ? n : null;
  }

  // Pure: every field's value for a speed in m/s.
  function values(ms) {
    var out = {};
    Object.keys(FIELDS).forEach(function (k) { out[k] = FIELDS[k].fmt(ms); });
    return out;
  }

  // Pure: the time-for-distance table at a speed in m/s.
  function view(ms) {
    if (!ms) return '<p class="error">' + t("Enter a pace or a speed.", "Inserisci un passo o una velocità.") + "</p>";
    var html = '<div class="table-wrap"><table><thead><tr><th>' + t("Distance", "Distanza") + "</th><th>" + t("Time at this pace", "Tempo a questo passo") + "</th></tr></thead><tbody>";
    DISTANCES.forEach(function (d) {
      var s = d[0] / ms;
      html += "<tr><td>" + d[1] + "</td><td>" + SB.formatTime(s, s < 600 ? 1 : 0) + "</td></tr>";
    });
    return html + "</tbody></table></div>";
  }

  // Pure: a mark in metres to feet and inches. US results measure to the
  // lesser quarter inch, so the quarter-inch figure rounds down.
  function toImperial(m) {
    var inches = m / INCH;
    var quarters = Math.floor(inches * 4 + 1e-9);
    return { feet: Math.floor(quarters / 48), inches: (quarters % 48) / 4, exactInches: inches };
  }

  // Pure: feet and inches to metres. World Athletics records marks to the
  // centimetre below, so this rounds down too.
  function toMetric(feet, inches) {
    var m = (feet * 12 + inches) * INCH;
    return { metres: Math.floor(m * 100 + 1e-9) / 100, exact: m };
  }

  function inchText(x) {
    var whole = Math.floor(x), q = Math.round((x - whole) * 4);
    var frac = ["", "¼", "½", "¾"][q];
    return (whole || !frac ? String(whole) : "") + frac;
  }

  function imperialText(r) { return r.feet + " ft " + inchText(r.inches) + " in"; }

  function marksView(m) {
    if (!m) return '<p class="error">' + t("Enter a mark.", "Inserisci una misura.") + "</p>";
    var imp = toImperial(m);
    return '<div class="stats">' +
      stat(t("Feet and inches", "Piedi e pollici"), imperialText(imp), t("rounded down to the ¼ inch", "arrotondato per difetto al ¼ di pollice"), true) +
      stat(t("Metres", "Metri"), SB.formatNum(m, 2) + " m", t("as on the result", "come nel risultato")) +
      stat(t("Exact inches", "Pollici esatti"), SB.formatNum(imp.exactInches, 2), t("before rounding", "prima dell’arrotondamento")) +
      "</div>";
  }

  function stat(k, v, s, hero) {
    return '<div class="stat' + (hero ? " hero" : "") + '"><span class="k">' + k + '</span><output class="v">' + v + '</output><div class="s">' + s + "</div></div>";
  }

  function bindPace() {
    var form = SB.$("#pace-form");
    if (!form) return;
    var last = "perKm";
    function run(e) {
      var name = e && e.target && FIELDS[e.target.name] ? e.target.name : last;
      last = name;
      var el = form.elements[name];
      var ms = FIELDS[name].toMs(el.value);
      SB.invalid(el, !ms);
      if (ms) {
        var v = values(ms);
        Object.keys(FIELDS).forEach(function (k) {
          if (k !== name) { form.elements[k].value = v[k]; SB.invalid(form.elements[k], false); }
        });
      }
      SB.$("#pace-results").innerHTML = view(ms);
    }
    // An example chip fills one field; make that the field the others follow.
    SB.$all("[data-fill]", form).forEach(function (chip) {
      chip.addEventListener("click", function () { last = Object.keys(JSON.parse(chip.getAttribute("data-fill")))[0]; }, true);
    });
    SB.bind(form, run);
  }

  function bindMarks() {
    var form = SB.$("#marks-form");
    if (!form) return;
    function run(e) {
      var src = e && e.target ? e.target.name : "metres";
      var m;
      if (src === "feet" || src === "inches") {
        var f = num(form.elements.feet.value) || 0;
        var i = form.elements.inches.value.trim() === "" ? 0 : (num(form.elements.inches.value) || 0);
        if (form.elements.inches.value.trim() === "0") i = 0;
        var bad = (!f && !i) || i >= 12;
        SB.invalid(form.elements.feet, bad);
        SB.invalid(form.elements.inches, i >= 12);
        if (bad) { SB.$("#marks-results").innerHTML = marksView(null); return; }
        m = toMetric(f, i).metres;
        form.elements.metres.value = SB.formatNum(m, 2);
        SB.invalid(form.elements.metres, false);
      } else {
        m = num(form.elements.metres.value);
        SB.invalid(form.elements.metres, !m);
        if (m) {
          var imp = toImperial(m);
          form.elements.feet.value = imp.feet;
          form.elements.inches.value = SB.formatNum(imp.inches, 2).replace(/[.,]?0+$/, "");
        }
      }
      SB.$("#marks-results").innerHTML = marksView(m);
    }
    SB.bind(form, run);
  }

  SB.paceConverter = { FIELDS: FIELDS, values: values, view: view, toImperial: toImperial, toMetric: toMetric, marksView: marksView, num: num };
  if (document.getElementById && document.getElementById("pace-form")) { bindPace(); bindMarks(); }
})();
