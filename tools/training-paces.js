/* Training paces from PB. Needs core.js. */
(function () {
  "use strict";
  var SB = window.SB, t = SB.t;

  var PERCENTS = [120, 115, 110, 105, 100, 95, 90, 85, 80, 75, 70, 65, 60];

  // Rep distances that make sense for each PB event.
  var REPS = {
    100: [60, 100, 150, 200, 300],
    200: [100, 150, 200, 300, 400],
    400: [100, 150, 200, 300, 400, 600],
    800: [200, 300, 400, 600, 800, 1000],
    1500: [200, 300, 400, 600, 800, 1000, 1200],
    1609.344: [200, 300, 400, 600, 800, 1000, 1200],
    3000: [200, 400, 600, 800, 1000, 1200, 1600, 2000],
    5000: [400, 600, 800, 1000, 1200, 1600, 2000],
    10000: [400, 800, 1000, 1200, 1600, 2000, 3000]
  };

  function repsFor(dist) {
    var key = Object.keys(REPS).filter(function (k) { return Math.abs(parseFloat(k) - dist) < 0.5; })[0];
    return key ? REPS[key] : REPS[800];
  }

  // Rep time at p% of PB speed: rep distance × (PB time ÷ PB distance) ÷ (p ÷ 100).
  function repTime(repDist, pb, pct) {
    return repDist * (pb.time / pb.dist) / (pct / 100);
  }

  function compute(pb) {
    var reps = repsFor(pb.dist);
    return {
      pb: pb, reps: reps,
      rows: PERCENTS.map(function (pct) {
        return { pct: pct, times: reps.map(function (d) { return repTime(d, pb, pct); }) };
      })
    };
  }

  // Track style: 1500 m without a separator, 10,000 m with one.
  function trackDist(d) {
    if (Math.abs(d - SB.MILE) < 0.5) return t("mile", "miglio");
    var n = Math.round(d);
    return (n < 10000 ? String(n) : SB.formatNum(n)) + " m";
  }

  // Tenths for reps up to 400 m, whole seconds above: one precision per column.
  function fmt(sec, repDist) { return SB.formatTime(sec, repDist <= 400 ? 1 : 0); }

  // Pure: the results markup. Also used to write the page's static example.
  function view(res) {
    if (!res) return '<p class="error">' + t("Enter your PB time, like 2:00.00.", "Inserisci il tuo personale, per esempio 2:00.00.") + "</p>";
    var pb = res.pb;
    var html = '<div class="stats">' +
      stat(t("PB pace", "Passo del personale"), SB.formatTime(pb.time / pb.dist * 400, 1), t("per 400 m = 100%", "ogni 400 m = 100%"), true) +
      stat(t("Per 100 m", "Ogni 100 m"), SB.formatTime(pb.time / pb.dist * 100, 2), t("at 100%", "al 100%")) +
      stat(t("Per km", "Al km"), SB.formatTime(pb.time / pb.dist * 1000, 0), t("at 100%", "al 100%")) +
      "</div>";
    html += '<p class="note">' + t("Your PB: ", "Il tuo personale: ") + trackDist(pb.dist) + t(" in ", " in ") + SB.formatTime(pb.time, pb.time < 600 ? 2 : 1) +
      t(". Each cell is the time for one rep.", ". Ogni casella è il tempo di una ripetuta.") + "</p>";
    html += '<div class="table-wrap"><table class="paces"><thead><tr><th>% PB</th>';
    res.reps.forEach(function (d) { html += "<th>" + trackDist(d) + "</th>"; });
    html += "</tr></thead><tbody>";
    res.rows.forEach(function (r) {
      var hl = r.pct === 100 ? ' class="hl"' : "";
      html += "<tr><td" + hl + ">" + r.pct + "%</td>";
      r.times.forEach(function (s, i) { html += "<td" + hl + ">" + fmt(s, res.reps[i]) + "</td>"; });
      html += "</tr>";
    });
    html += "</tbody></table></div>";
    return html;
  }

  function stat(k, v, s, hero) {
    return '<div class="stat' + (hero ? " hero" : "") + '"><span class="k">' + k + '</span><output class="v">' + v + '</output><div class="s">' + s + "</div></div>";
  }

  function render() {
    var form = SB.$("#paces-form");
    var dist = parseFloat(form.elements.pbEvent.value);
    var timeEl = form.elements.pbTime;
    var time = SB.parseTime(timeEl.value);
    SB.invalid(timeEl, !time);
    SB.$("#paces-results").innerHTML = view(time ? compute({ dist: dist, time: time }) : null);
  }

  SB.trainingPaces = { compute: compute, view: view, repTime: repTime };
  if (document.getElementById && document.getElementById("paces-form")) {
    SB.bind("#paces-form", render);
    var printBtn = document.getElementById("paces-print");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
  }
})();
