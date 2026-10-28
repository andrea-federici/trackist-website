/* Race split planner. Needs core.js. */
(function () {
  "use strict";
  var SB = window.SB, t = SB.t;

  // The distances where the time is read: every crossing of the finish line,
  // plus the half-lap marks in the one- and two-lap races.
  function marks(dist, lap) {
    var out = [];
    if (dist <= 800) {
      var step = dist === 400 ? 100 : 200;
      for (var m = step; m <= dist; m += step) out.push(m);
      return out;
    }
    var first = dist % lap;
    if (first < 1e-6) first = lap;
    if (first < 50) first += lap; // the mile starts 9.34 m behind the line
    for (var x = first; x < dist + 1e-6; x += lap) out.push(Math.round(x * 1000) / 1000);
    // 10,000 m indoors would be 50 rows: read it every 400 m instead.
    if (out.length > 30) out = out.filter(function (v, i) { return (out.length - 1 - i) % 2 === 0; });
    return out;
  }

  // Pace changes in a straight line from start to finish, so that the second
  // half takes `fade` (a fraction) longer than the first. fade 0 is even pace.
  // Cumulative time at x: a·x + b·x²/2, where pace(x) = a + b·x.
  function profile(dist, total, fade) {
    var t1 = total / (2 + fade), t2 = total - t1;
    var b = 4 * (t2 - t1) / (dist * dist);
    var a = (total - b * dist * dist / 2) / dist;
    return { t1: t1, t2: t2, at: function (x) { return a * x + b * x * x / 2; } };
  }

  function compute(dist, total, lap, fadePct) {
    var p = profile(dist, total, fadePct / 100);
    var prevX = 0, prevT = 0;
    var rows = marks(dist, lap).map(function (x) {
      var cum = p.at(x);
      var row = { mark: x, cum: cum, seg: cum - prevT, segDist: x - prevX, per400: (cum - prevT) / (x - prevX) * 400 };
      prevX = x; prevT = cum;
      return row;
    });
    return { dist: dist, total: total, lap: lap, fade: fadePct, t1: p.t1, t2: p.t2, avg400: total / dist * 400, rows: rows };
  }

  // Track style: 1500 m and 3000 m without a separator, 10,000 m with one.
  function trackDist(d) {
    if (Math.abs(d - SB.MILE) < 0.5) return t("Mile", "Miglio");
    var n = Math.round(d);
    return (n < 10000 ? String(n) : SB.formatNum(n)) + " m";
  }

  // Pure: the results markup. Also used to write the page's static example.
  function view(res) {
    if (!res) return '<p class="error">' + t("Enter a target time like 2:00.00.", "Inserisci un tempo obiettivo come 2:00.00.") + "</p>";
    var dp = res.dist <= 800 ? 2 : 1;
    var half = Math.abs(res.dist - SB.MILE) < 1 ? t("half mile", "mezzo miglio") : trackDist(res.dist / 2);
    var html = '<div class="stats">' +
      stat(t("Target", "Obiettivo"), SB.formatTime(res.total, dp), trackDist(res.dist), true) +
      stat(t("Average pace", "Passo medio"), SB.formatTime(res.avg400, dp), t("per 400 m", "ogni 400 m")) +
      stat(t("First half", "Prima metà"), SB.formatTime(res.t1, dp), half) +
      stat(t("Second half", "Seconda metà"), SB.formatTime(res.t2, dp),
        res.fade === 0 ? t("even pace", "ritmo costante") :
        (res.t2 > res.t1 ? "+" : "−") + SB.formatTime(Math.abs(res.t2 - res.t1), dp) + t(" on the first half", " sulla prima metà")) +
      "</div>";
    html += '<div class="table-wrap"><table><thead><tr><th>' + t("Mark", "Passaggio") + "</th><th>" + t("Split", "Tempo") + "</th><th>" +
      t("Segment", "Tratto") + "</th><th>" + t("Segment time", "Tempo del tratto") + "</th><th>" + t("Pace /400 m", "Passo /400 m") + "</th></tr></thead><tbody>";
    res.rows.forEach(function (r, i) {
      var last = i === res.rows.length - 1;
      html += "<tr><td>" + trackDist(r.mark) + "</td>" +
        "<td" + (last ? ' class="hl"' : "") + ">" + SB.formatTime(r.cum, dp) + "</td>" +
        "<td>" + trackDist(r.segDist) + "</td>" +
        "<td>" + SB.formatTime(r.seg, dp) + "</td>" +
        "<td>" + SB.formatTime(r.per400, 1) + "</td></tr>";
    });
    html += "</tbody></table></div>";
    if (res.lap === 200 && res.dist >= 10000) {
      html += '<p class="note">' + t("50 laps is a long table, so it shows every second lap.", "50 giri sono tanti: la tabella mostra un giro sì e uno no.") + "</p>";
    }
    return html;
  }

  function stat(k, v, s, hero) {
    return '<div class="stat' + (hero ? " hero" : "") + '"><span class="k">' + k + '</span><output class="v">' + v + '</output><div class="s">' + s + "</div></div>";
  }

  function render() {
    var form = SB.$("#split-form");
    var dist = parseFloat(form.elements.event.value);
    var timeEl = form.elements.target;
    var total = SB.parseTime(timeEl.value);
    var lap = parseFloat(form.elements.track.value);
    var fadeEl = form.elements.fade;
    var fade = fadeEl.value.trim() === "" ? 0 : parseFloat(fadeEl.value.replace(",", ".").replace("−", "-"));
    var fadeOk = isFinite(fade) && fade > -20 && fade < 30;
    SB.invalid(timeEl, !total);
    SB.invalid(fadeEl, !fadeOk);
    SB.$("#split-results").innerHTML = view(total && fadeOk ? compute(dist, total, lap, fade) : null);
  }

  SB.splitPlanner = { marks: marks, compute: compute, view: view };
  if (document.getElementById && document.getElementById("split-form")) SB.bind("#split-form", render);
})();
