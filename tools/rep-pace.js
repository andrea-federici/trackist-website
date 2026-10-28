/* Rep pace & splits calculator. Needs core.js. */
(function () {
  "use strict";
  var SB = window.SB, t = SB.t;

  var TIME = "[0-9][0-9:.,'\"″′]*s?";
  var SEG = new RegExp(
    "^(?:(\\d+)\\s*[x×*]\\s*)?" +                       // reps
    "(\\d+(?:[.,]\\d+)?\\s*(?:m|k|km|mi|mile|miglio)?)" + // distance
    "(?:\\s*(?:in|@|at|a|=)?\\s*(" + TIME + "(?:\\s*[-–]\\s*" + TIME + ")?))?" + // time or range
    "(?:\\s*(?:r|rec|rest|recovery|recupero|rec\\.)\\s*(" + TIME + "))?\\s*$", "i");
  var REST_ONLY = new RegExp("^(?:r|rec|rest|recovery|recupero|rec\\.)\\s*(" + TIME + ")\\s*$", "i");

  // "6x200 in 27-28, rec 2:00 + 4x100 in 13" → segments.
  function parseSession(text) {
    var pieces = String(text || "").split(/[,;+\n]+/).map(function (s) { return s.trim(); }).filter(Boolean);
    var segs = [], bad = [];
    pieces.forEach(function (p) {
      var r = p.match(REST_ONLY);
      if (r && segs.length) { segs[segs.length - 1].rest = SB.parseTime(r[1]); return; }
      var m = p.match(SEG);
      if (!m) { bad.push(p); return; }
      var dist = SB.parseDistance(m[2]);
      var range = m[3] ? SB.parseRange(m[3]) : null;
      if (!dist || !range || range.mid <= 0) { bad.push(p); return; }
      segs.push({ text: p, reps: m[1] ? parseInt(m[1], 10) : 1, dist: dist, range: range, rest: m[4] ? SB.parseTime(m[4]) : null });
    });
    return { segs: segs, bad: bad };
  }

  function compute(text, pb) {
    var parsed = parseSession(text);
    var rows = parsed.segs.map(function (s) {
      var pace = s.range.mid / s.dist; // seconds per metre
      return {
        seg: s,
        per100: pace * 100, per200: pace * 200, per400: pace * 400, perKm: pace * 1000,
        kmh: 3.6 / pace, ms: 1 / pace,
        pctPb: pb ? (pb.time / pb.dist) / pace * 100 : null
      };
    });
    var volume = 0, running = 0, rest = 0;
    parsed.segs.forEach(function (s) {
      volume += s.reps * s.dist;
      running += s.reps * s.range.mid;
      if (s.rest) rest += (s.reps - 1) * s.rest;
    });
    return { rows: rows, bad: parsed.bad, volume: volume, running: running, rest: rest };
  }

  function rangeText(r, dp) {
    return r.lo === r.hi ? SB.formatTime(r.lo, dp) : SB.formatTime(r.lo, dp) + "–" + SB.formatTime(r.hi, dp);
  }

  function render() {
    var form = SB.$("#rep-form");
    var sessionEl = form.elements.session;
    var pbDist = parseFloat(form.elements.pbEvent.value);
    var pbTime = SB.parseTime(form.elements.pbTime.value);
    SB.invalid(form.elements.pbTime, form.elements.pbTime.value.trim() !== "" && !pbTime);
    var pb = pbDist && pbTime ? { dist: pbDist, time: pbTime } : null;
    var res = compute(sessionEl.value, pb);
    SB.invalid(sessionEl, res.bad.length > 0 || !res.rows.length);
    SB.$("#rep-results").innerHTML = view(res, pb);
  }

  // Pure: the results markup. Also used to write the page's static example.
  function view(res, pb) {
    if (!res.rows.length) {
      return '<p class="error">' + t("Write a session like 6x200 in 27-28.", "Scrivi una seduta come 6x200 in 27-28.") + "</p>";
    }
    var avgPer400 = res.running / res.volume * 400;
    var html = '<div class="stats">' +
      stat(t("Total volume", "Volume totale"), SB.formatDistance(res.volume), t("of fast running", "di corsa veloce"), true) +
      stat(t("Running time", "Tempo di corsa"), SB.formatTime(res.running, 1), res.rest ? t("plus ", "più ") + SB.formatTime(res.rest, 0) + t(" of recovery", " di recupero") : t("not counting recovery", "senza i recuperi")) +
      stat(t("Average pace", "Passo medio"), SB.formatTime(avgPer400, 1), t("per 400 m", "ogni 400 m")) +
      "</div>";

    html += '<div class="table-wrap"><table><thead><tr>' +
      "<th>" + t("Reps", "Ripetute") + "</th><th>" + t("Target", "Obiettivo") + "</th><th>/100 m</th><th>/400 m</th><th>/km</th><th>km/h</th>" +
      (pb ? "<th>% PB</th>" : "") + "</tr></thead><tbody>";
    res.rows.forEach(function (r) {
      var s = r.seg;
      html += "<tr><td>" + s.reps + " × " + SB.formatDistance(s.dist) + "</td>" +
        "<td>" + rangeText(s.range) + "</td>" +
        "<td>" + SB.formatTime(r.per100, 1) + "</td>" +
        "<td>" + SB.formatTime(r.per400, 1) + "</td>" +
        "<td>" + SB.formatTime(r.perKm, 0) + "</td>" +
        "<td>" + SB.formatNum(r.kmh, 1) + "</td>" +
        (pb ? '<td class="hl">' + SB.formatNum(r.pctPb, 0) + "%</td>" : "") + "</tr>";
    });
    html += "</tbody></table></div>";

    // What race pace each block is.
    html += '<div class="table-wrap"><table><thead><tr><th>' + t("At this pace", "A questo passo") + "</th><th>400 m</th><th>800 m</th><th>1500 m</th><th>5000 m</th></tr></thead><tbody>";
    res.rows.forEach(function (r) {
      var p = r.per100 / 100;
      html += "<tr><td>" + r.seg.reps + " × " + SB.formatDistance(r.seg.dist) + "</td>" +
        "<td>" + SB.formatTime(p * 400, 1) + "</td><td>" + SB.formatTime(p * 800, 1) + "</td><td>" + SB.formatTime(p * 1500, 1) + "</td><td>" + SB.formatTime(p * 5000, 0) + "</td></tr>";
    });
    html += "</tbody></table></div>";

    if (res.bad.length) {
      html += '<p class="warn">' + t("Skipped, could not read: ", "Ignorato, non leggibile: ") + res.bad.map(SB.esc).join(", ") + "</p>";
    }
    return html;
  }

  function stat(k, v, s, hero) {
    return '<div class="stat' + (hero ? " hero" : "") + '"><span class="k">' + k + '</span><output class="v">' + v + '</output><div class="s">' + s + "</div></div>";
  }

  SB.repPace = { parseSession: parseSession, compute: compute, view: view };
  if (document.getElementById && document.getElementById("rep-form")) SB.bind("#rep-form", render);
})();
