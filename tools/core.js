/*
  Track tools: shared helpers for every calculator page.

  First-party and inert in the sense AGENTS.md means: no request, no cookie,
  no storage, no third party, nothing recorded about the visitor. Every page
  also carries a worked result in its HTML, so it still says something useful
  if this never runs.
*/
(function () {
  "use strict";

  var lang = (document.documentElement.lang || "en").slice(0, 2) === "it" ? "it" : "en";

  function t(en, it) { return lang === "it" ? it : en; }

  // "52.3", "52,3", "1:52.3", "1.52.3" (Italian results style), "1'52\"3",
  // "1'52", "2'", "90s", "1:02:15". Returns seconds or null.
  function parseTime(input) {
    if (input == null) return null;
    var s = String(input).trim().toLowerCase().replace(/\s+/g, "");
    if (!s) return null;
    s = s.replace(/″|''/g, '"').replace(/′|’/g, "'");
    var m;
    // Minutes and seconds with ' and " marks: 1'52"3, 1'52, 2', 52"3
    if (/['"]/.test(s)) {
      m = s.match(/^(?:(\d+)')?(?:(\d+(?:[.,]\d+)?)(?:"(\d+))?)?"?$/);
      if (!m || (m[1] == null && m[2] == null)) return null;
      var sec = m[2] != null ? parseFloat(m[2].replace(",", ".")) : 0;
      if (m[3] != null) sec = parseFloat((m[2] || "0") + "." + m[3]);
      return (m[1] ? parseInt(m[1], 10) * 60 : 0) + sec;
    }
    if ((m = s.match(/^(\d+(?:[.,]\d+)?)s$/))) return parseFloat(m[1].replace(",", "."));
    if ((m = s.match(/^(\d+)min$/))) return parseInt(m[1], 10) * 60;
    // Colon form: h:mm:ss(.x) or m:ss(.x)
    if (s.indexOf(":") >= 0) {
      var parts = s.split(":");
      if (parts.length > 3) return null;
      var total = 0;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i].replace(",", ".");
        if (!/^\d+(\.\d+)?$/.test(p)) return null;
        if (i < parts.length - 1 && p.indexOf(".") >= 0) return null;
        total = total * 60 + parseFloat(p);
      }
      return total;
    }
    // Italian results write 1.52.30 for 1:52.30.
    if ((m = s.match(/^(\d+)\.(\d{2})[.,](\d+)$/))) return parseInt(m[1], 10) * 60 + parseFloat(m[2] + "." + m[3]);
    if ((m = s.match(/^\d+(?:[.,]\d+)?$/))) return parseFloat(s.replace(",", "."));
    return null;
  }

  // "27-28", "27–28", "1:05-1:07", "27". Returns { lo, hi, mid } or null.
  function parseRange(input) {
    if (input == null) return null;
    var s = String(input).trim();
    var parts = s.split(/\s*[-–—]\s*|\s+to\s+|\s+a\s+/i);
    if (parts.length === 1) {
      var v = parseTime(parts[0]);
      return v == null ? null : { lo: v, hi: v, mid: v };
    }
    if (parts.length !== 2) return null;
    var a = parseTime(parts[0]), b = parseTime(parts[1]);
    if (a == null || b == null) return null;
    // "1:05-07" means 1:05 to 1:07.
    if (/:/.test(parts[0]) && !/:/.test(parts[1]) && b < 60 && a >= 60) b = Math.floor(a / 60) * 60 + b;
    var lo = Math.min(a, b), hi = Math.max(a, b);
    return { lo: lo, hi: hi, mid: (lo + hi) / 2 };
  }

  // Metres from "200", "200m", "1k", "1.5km", "1 mile", "mile", "1mi".
  var MILE = 1609.344;
  function parseDistance(input) {
    if (input == null) return null;
    var s = String(input).trim().toLowerCase().replace(/\s+/g, "").replace(",", ".");
    var m = s.match(/^(\d+(?:\.\d+)?)?(m|k|km|mi|mile|miles|miglio|miglia)?$/);
    if (!m || (!m[1] && !m[2])) return null;
    var n = m[1] ? parseFloat(m[1]) : 1;
    var u = m[2] || "m";
    if (u === "k" || u === "km") return n * 1000;
    if (u === "m") return n;
    return n * MILE;
  }

  function pad(n, w) { n = String(n); while (n.length < w) n = "0" + n; return n; }

  // Seconds to athletics notation: 27.50, 1:52.30, 14:05.2, 1:02:15.
  // dp is the number of decimals kept on the seconds.
  function formatTime(sec, dp) {
    if (sec == null || !isFinite(sec)) return "–";
    if (dp == null) dp = sec < 600 ? 2 : (sec < 3600 ? 1 : 0);
    var f = Math.pow(10, dp);
    var r = Math.round(sec * f) / f;
    var h = Math.floor(r / 3600);
    var mi = Math.floor((r - h * 3600) / 60);
    var s = r - h * 3600 - mi * 60;
    var sStr = s.toFixed(dp);
    if (h > 0) return h + ":" + pad(mi, 2) + ":" + pad(sStr, dp ? dp + 3 : 2);
    if (mi > 0) return mi + ":" + pad(sStr, dp ? dp + 3 : 2);
    return sStr;
  }

  // Pace in minutes and seconds with no decimals unless asked: 3:05.
  function formatPace(sec, dp) { return formatTime(sec, dp == null ? 0 : dp); }

  function formatNum(x, dp) {
    if (x == null || !isFinite(x)) return "–";
    return x.toLocaleString(lang === "it" ? "it-IT" : "en-GB", { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 });
  }

  // Metres in a readable form: 1,200 m, 5 km, 1 mile.
  function formatDistance(m) {
    if (Math.abs(m - MILE) < 0.5) return t("1 mile", "1 miglio");
    if (m >= 1000 && m % 1000 === 0) return formatNum(m / 1000) + " km";
    // Track distances under 10 km are written without a separator: 1500 m.
    return (m < 10000 ? String(Math.round(m)) : formatNum(m)) + " m";
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // Runs fn on every input change in the form and once now.
  function bind(form, fn) {
    if (typeof form === "string") form = $(form);
    if (!form) return;
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    form.addEventListener("input", fn);
    form.addEventListener("change", fn);
    $all("[data-fill]", form).forEach(function (chip) {
      chip.addEventListener("click", function () {
        var values = JSON.parse(chip.getAttribute("data-fill"));
        Object.keys(values).forEach(function (name) {
          var el = form.elements[name];
          if (!el) return;
          if (el.length && el[0] && el[0].type === "radio") {
            Array.prototype.forEach.call(el, function (r) { r.checked = r.value === String(values[name]); });
          } else {
            el.value = values[name];
          }
        });
        fn();
      });
    });
    fn();
  }

  function invalid(el, bad) { if (el) el.setAttribute("aria-invalid", bad ? "true" : "false"); }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  window.SB = {
    lang: lang, t: t, MILE: MILE,
    parseTime: parseTime, parseRange: parseRange, parseDistance: parseDistance,
    formatTime: formatTime, formatPace: formatPace, formatNum: formatNum, formatDistance: formatDistance,
    $: $, $all: $all, bind: bind, invalid: invalid, esc: esc
  };
})();
