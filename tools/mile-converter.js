/* 1500 m, mile and 1600 m converter. Needs core.js. */
(function () {
  "use strict";
  var SB = window.SB, t = SB.t;
  var K = 1.06; // Riegel's exponent
  var M = SB.MILE;

  var GROUPS = [[1500, M, 1600], [3000, 2 * M, 3200]];

  function eventName(d) {
    if (Math.abs(d - M) < 0.5) return t("Mile", "Miglio");
    if (Math.abs(d - 2 * M) < 0.5) return t("2 miles", "2 miglia");
    // Track events are written 1500 m, not 1,500 m; only 10,000 m takes a separator.
    return (d >= 10000 ? SB.formatNum(d) : String(d)) + " m";
  }

  // The event each input converts to first: metric to imperial, and back.
  var MAIN_TARGET = {};
  MAIN_TARGET[1500] = M; MAIN_TARGET[1600] = M; MAIN_TARGET[3000] = 2 * M; MAIN_TARGET[3200] = 2 * M;
  function mainTarget(d) {
    if (Math.abs(d - M) < 0.5) return 1500;
    if (Math.abs(d - 2 * M) < 0.5) return 3000;
    return MAIN_TARGET[d];
  }

  function compute(dist, time) {
    if (!dist || !time) return null;
    var group = GROUPS.filter(function (g) { return g.some(function (d) { return Math.abs(d - dist) < 0.5; }); })[0];
    if (!group) return null;
    var rows = group.map(function (d) {
      var same = Math.abs(d - dist) < 0.5;
      return {
        dist: d, own: same,
        riegel: same ? time : time * Math.pow(d / dist, K),
        evenPace: same ? time : time * d / dist
      };
    });
    var target = mainTarget(dist);
    var main = rows.filter(function (r) { return Math.abs(r.dist - target) < 0.5; })[0];
    return { dist: dist, time: time, rows: rows, main: main, factor: Math.pow(target / dist, K) };
  }

  function stat(k, v, s, hero) {
    return '<div class="stat' + (hero ? " hero" : "") + '"><span class="k">' + k + '</span><output class="v">' + v + '</output><div class="s">' + s + "</div></div>";
  }

  // Pure: the results markup. Also used to write the page's static example.
  function view(res) {
    if (!res) return '<p class="error">' + t("Enter a time, like 4:10.00.", "Inserisci un tempo, per esempio 4:10.00.") + "</p>";
    var html = '<div class="stats">' +
      stat(eventName(res.main.dist), SB.formatTime(res.main.riegel), t("estimate from ", "stima dai ") + eventName(res.dist) + " " + SB.formatTime(res.time), true) +
      stat(t("Factor", "Fattore"), "× " + SB.formatNum(res.factor, 4), t("Riegel, exponent 1.06", "Riegel, esponente 1,06")) +
      "</div>";
    html += '<div class="table-wrap"><table><thead><tr><th>' + t("Event", "Gara") + "</th><th>" + t("Estimate", "Stima") + "</th><th>" + t("Same pace", "Stesso passo") + "</th><th>/400 m</th></tr></thead><tbody>";
    res.rows.forEach(function (r) {
      var cls = r.own ? ' class="hl"' : "";
      html += "<tr><td" + cls + ">" + eventName(r.dist) + "</td><td" + cls + ">" + SB.formatTime(r.riegel) + "</td><td>" + SB.formatTime(r.evenPace) + "</td><td>" + SB.formatTime(r.riegel / r.dist * 400, 1) + "</td></tr>";
    });
    html += "</tbody></table></div>";
    html += '<p class="note">' + t("Same pace is the time if you held exactly the same pace over the other distance. The estimate allows for pace dropping as a race gets longer, so it is the one to use.",
      "Stesso passo è il tempo tenendo esattamente lo stesso passo sull’altra distanza. La stima tiene conto del passo che cala quando la gara si allunga, quindi è quella da usare.") + "</p>";
    return html;
  }

  function render() {
    var form = SB.$("#mile-form");
    var d = parseFloat(form.elements.event.value);
    var raw = form.elements.time.value;
    var s = SB.parseTime(raw);
    SB.invalid(form.elements.time, raw.trim() !== "" && !s);
    SB.$("#mile-results").innerHTML = view(compute(d, s));
  }

  SB.mileConverter = { compute: compute, view: view };
  if (document.getElementById && document.getElementById("mile-form")) SB.bind("#mile-form", render);
})();
