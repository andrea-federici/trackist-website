/* Lane distances and staggers on a standard 400 m track. Needs core.js. */
(function () {
  "use strict";
  var SB = window.SB, t = SB.t;

  // World Athletics standard 400 m track: bends of radius 36.50 m to the kerb.
  // Lane 1 is measured 0.30 m outside the kerb, every other lane 0.20 m outside
  // the line on its inside (Technical Rule 14). The lane width includes the line
  // on the right.
  var RADIUS = 36.5;
  var LANE1_OFFSET = 0.30;
  var LINE_OFFSET = 0.20;
  var STRAIGHT = (400 - 2 * Math.PI * (RADIUS + LANE1_OFFSET)) / 2; // 84.39 m

  function runningRadius(lane, width) {
    return lane === 1 ? RADIUS + LANE1_OFFSET : RADIUS + (lane - 1) * width + LINE_OFFSET;
  }

  // Stagger for a race run in lanes for `bends` bends. With a break line, the
  // athlete then cuts across the next straight to lane 1, which is a little longer
  // than the straight itself; the start moves forward by that extra too.
  function stagger(lane, width, bends, cutIn) {
    if (lane === 1) return 0;
    var d = runningRadius(lane, width) - runningRadius(1, width);
    var s = bends * Math.PI * d;
    if (cutIn) s += Math.sqrt(STRAIGHT * STRAIGHT + d * d) - STRAIGHT;
    return s;
  }

  function lap(lane, width) { return 2 * STRAIGHT + 2 * Math.PI * runningRadius(lane, width); }

  function compute(lanes, width, bends, cutIn) {
    if (!(lanes >= 1) || !(width >= 1 && width <= 1.3)) return null;
    var rows = [];
    for (var n = 1; n <= lanes; n++) {
      rows.push({
        lane: n,
        radius: runningRadius(n, width),
        lap: lap(n, width),
        s200: stagger(n, width, 1, false),
        s400: stagger(n, width, 2, false),
        s800: stagger(n, width, 1, true),
        s4x400: stagger(n, width, 3, true),
        custom: bends >= 1 ? stagger(n, width, bends, cutIn) : null
      });
    }
    return { rows: rows, width: width, bends: bends, cutIn: cutIn, lanes: lanes };
  }

  function m(x, dp) { return SB.formatNum(x, dp == null ? 2 : dp); }

  function stat(k, v, s, hero) {
    return '<div class="stat' + (hero ? " hero" : "") + '"><span class="k">' + k + '</span><output class="v">' + v + '</output><div class="s">' + s + "</div></div>";
  }

  // Pure: the results markup. Also used to write the page's static example.
  function view(res) {
    if (!res) return '<p class="error">' + t("Enter a lane width between 1.00 and 1.30 m.", "Inserisci una larghezza di corsia tra 1,00 e 1,30 m.") + "</p>";
    var last = res.rows[res.rows.length - 1];
    var html = '<div class="stats">' +
      stat(t("Lane ", "Corsia ") + last.lane + t(" lap", ", un giro"), m(last.lap, 2) + " m", t("if you stayed in the lane", "se resti nella corsia"), true) +
      stat(t("Extra per lane", "In più per corsia"), "+" + m(2 * Math.PI * res.width, 2) + " m", t("each lap, lanes 2 and out", "a giro, dalla corsia 2 in fuori")) +
      stat(t("400 m stagger, lane ", "Décalage 400 m, corsia ") + last.lane, m(last.s400, 2) + " m", t("ahead of lane 1", "davanti alla corsia 1")) +
      "</div>";
    var customHead = res.bends >= 1 ? "<th>" + res.bends + " " + (res.bends === 1 ? t("bend", "curva") : t("bends", "curve")) + (res.cutIn ? t(" + cut in", " + rientro") : "") + "</th>" : "";
    html += '<div class="table-wrap"><table><thead><tr><th>' + t("Lane", "Corsia") + "</th><th>" + t("One lap", "Un giro") + "</th><th>200 m</th><th>400 m · 4×100</th><th>800 m</th><th>4×400</th>" + customHead + "</tr></thead><tbody>";
    res.rows.forEach(function (r) {
      html += "<tr><td>" + r.lane + "</td><td>" + m(r.lap, 2) + "</td><td>" + m(r.s200) + "</td><td>" + m(r.s400) + "</td><td>" + m(r.s800) + "</td><td>" + m(r.s4x400) + "</td>" +
        (r.custom != null ? '<td class="hl">' + m(r.custom) + "</td>" : "") + "</tr>";
    });
    html += "</tbody></table></div>";
    html += '<p class="note">' + t("Staggers in metres ahead of lane 1. 800 m: in lanes for one bend. 4×400: in lanes for three bends. Both then cut in at the break line.",
      "Décalage in metri davanti alla corsia 1. 800 m: in corsia per una curva. 4×400: in corsia per tre curve. Poi si rientra alla linea di rientro.") + "</p>";
    return html;
  }

  function render() {
    var form = SB.$("#lane-form");
    var widthEl = form.elements.width, bendsEl = form.elements.bends;
    var width = parseFloat(String(widthEl.value).replace(",", "."));
    var bends = bendsEl.value.trim() === "" ? 0 : parseInt(bendsEl.value, 10);
    SB.invalid(widthEl, !(width >= 1 && width <= 1.3));
    SB.invalid(bendsEl, bendsEl.value.trim() !== "" && !(bends >= 1 && bends <= 8));
    if (!(bends >= 1 && bends <= 8)) bends = 0;
    var res = compute(parseInt(form.elements.lanes.value, 10), width, bends, form.elements.cutIn.value === "yes");
    SB.$("#lane-results").innerHTML = view(res);
  }

  SB.lanes = { compute: compute, view: view, stagger: stagger, lap: lap, runningRadius: runningRadius, STRAIGHT: STRAIGHT };
  if (document.getElementById && document.getElementById("lane-form")) SB.bind("#lane-form", render);
})();
