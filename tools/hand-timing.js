/* Hand time to FAT converter. Needs core.js. */
(function () {
  "use strict";
  var SB = window.SB, t = SB.t;

  // Seconds added to a hand time, by race distance in metres.
  var CONVENTIONS = {
    tfn: {
      name: t("Statistics (T&amp;F News)", "Statistiche (T&amp;F News)"),
      add: function (d) { return d < 300 ? 0.24 : (d < 800 ? 0.14 : 0); }
    },
    combined: {
      name: t("Combined events", "Prove multiple"),
      add: function (d) { return d < 400 ? 0.24 : (d === 400 ? 0.14 : 0); }
    },
    nfhs: {
      name: t("US high school (NFHS)", "Licei USA (NFHS)"),
      add: function () { return 0.24; }
    }
  };
  var ORDER = ["tfn", "combined", "nfhs"];

  // Hand times are recorded to the tenth, rounded up: 10.83 is 10.9.
  function roundUpTenth(s) { return Math.ceil(s * 10 - 1e-6) / 10; }
  // FAT times are recorded to the hundredth, rounded up.
  function roundUpHundredth(s) { return Math.ceil(s * 100 - 1e-6) / 100; }

  // Pure. direction "toFat": hand → FAT estimate. "toHand": FAT → hand estimate.
  function convert(time, distance, convention, direction) {
    var add = CONVENTIONS[convention].add(distance);
    if (direction === "toHand") {
      var raw = roundUpHundredth(time) - add;
      return { add: add, raw: raw, result: roundUpTenth(raw) };
    }
    var hand = roundUpTenth(time);
    return { add: add, hand: hand, result: Math.round((hand + add) * 100) / 100 };
  }

  function view(time, distance, convention, direction) {
    if (!time) return '<p class="error">' + t("Enter a time, like 10.8.", "Inserisci un tempo, come 10.8.") + "</p>";
    var toHand = direction === "toHand";
    var r = convert(time, distance, convention, direction);
    var html = '<div class="stats">';
    if (toHand) {
      html += stat(t("Hand time estimate", "Stima manuale"), SB.formatTime(r.result, 1), t("rounded up to the tenth", "arrotondato per eccesso al decimo"), true) +
        stat(t("Before rounding", "Prima dell’arrotondamento"), SB.formatTime(r.raw, 2), t("FAT time − ", "tempo elettrico − ") + fmtAbs(r.add));
    } else {
      html += stat(t("FAT estimate", "Stima elettrica"), SB.formatTime(r.result, 2), t("hand time + ", "tempo manuale + ") + fmtAbs(r.add), true) +
        stat(t("Hand time as recorded", "Tempo manuale registrato"), SB.formatTime(r.hand, 1), r.hand !== time ? t("rounded up from ", "arrotondato per eccesso da ") + SB.formatTime(time, 2) : t("already in tenths", "già in decimi"));
    }
    html += stat(toHand ? t("Taken off", "Tolti") : t("Added", "Aggiunti"), r.add ? fmtAbs(r.add) : t("nothing", "nulla"), CONVENTIONS[convention].name) + "</div>";

    html += '<div class="table-wrap"><table><thead><tr><th>' + t("Convention", "Convenzione") + "</th><th>" + t("Difference", "Differenza") + "</th><th>" +
      (toHand ? t("Hand estimate", "Stima manuale") : t("FAT estimate", "Stima elettrica")) + "</th></tr></thead><tbody>";
    ORDER.forEach(function (k) {
      var c = convert(time, distance, k, direction);
      var cls = k === convention ? ' class="hl"' : "";
      html += "<tr><td>" + CONVENTIONS[k].name + "</td><td>" + (c.add ? fmtAbs(c.add) : t("none", "nessuna")) + "</td><td" + cls + ">" + SB.formatTime(c.result, toHand ? 1 : 2) + "</td></tr>";
    });
    html += "</tbody></table></div>";
    html += '<p class="warn">' + t("An estimate for comparing marks. A converted time is not valid for records, rankings that require FAT, or qualifying.",
      "Una stima per confrontare i tempi. Un tempo convertito non vale per record, graduatorie che richiedono il cronometraggio elettrico o minimi di partecipazione.") + "</p>";
    return html;
  }

  function fmtAbs(a) { return a.toFixed(2).replace(".", SB.lang === "it" ? "," : ".") + " s"; }

  function stat(k, v, s, hero) {
    return '<div class="stat' + (hero ? " hero" : "") + '"><span class="k">' + k + '</span><output class="v">' + v + '</output><div class="s">' + s + "</div></div>";
  }

  function render() {
    var form = SB.$("#hand-form");
    var time = SB.parseTime(form.elements.time.value);
    SB.invalid(form.elements.time, !time);
    var distance = parseFloat(form.elements.event.value);
    var dir = form.elements.direction.value;
    SB.$("#time-label").textContent = dir === "toHand" ? t("FAT time", "Tempo elettrico") : t("Hand time", "Tempo manuale");
    SB.$("#hand-results").innerHTML = view(time, distance, form.elements.convention.value, dir);
  }

  SB.handTiming = { CONVENTIONS: CONVENTIONS, convert: convert, view: view };
  if (document.getElementById && document.getElementById("hand-form")) SB.bind("#hand-form", render);
})();
