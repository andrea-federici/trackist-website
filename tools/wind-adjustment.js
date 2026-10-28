/* Wind adjustment for sprints and sprint hurdles. Needs core.js. */
(function () {
  "use strict";
  var SB = window.SB, t = SB.t;
  var MAX_WIND = 4;
  var LEGAL_WIND = 2;

  // Moinat, Fabius & Emanuel (2018), Eur J Sport Sci 18(9). w > 0 is a tailwind.
  // Each returns the still-air (0.0 m/s) equivalent of a time run in wind w.
  // The hurdle formula is fitted on hurdle races and returns a hurdle time.
  var MODELS = {
    "100": {
      still: function (p, w) { return p - 0.0449 * w + 0.009459 * p * w - 0.0042 * w * w; },
      atWind: function (p0, w) { return (p0 + 0.0449 * w + 0.0042 * w * w) / (1 + 0.009459 * w); }
    },
    "200": {
      still: function (p, w) { return p + 0.090 * w - 0.010 * w * w; },
      atWind: function (p0, w) { return p0 - 0.090 * w + 0.010 * w * w; }
    },
    "hurdles": {
      still: function (p, w) { return p + 0.093 * w - 0.010 * w * w; },
      atWind: function (p0, w) { return p0 - 0.093 * w + 0.010 * w * w; }
    }
  };

  var EVENTS = {
    "100": { model: "100", name: "100 m", hurdles: false },
    "200": { model: "200", name: "200 m", hurdles: false },
    "100H": { model: "hurdles", name: t("100 m hurdles", "100 hs"), hurdles: true },
    "110H": { model: "hurdles", name: t("110 m hurdles", "110 hs"), hurdles: true }
  };

  // Mureika (2001), 100 m only, sea level: t0 = tw × [1.027 − 0.027 × (1 − w·tw/100)²].
  function mureika100(tw, w) { return tw * (1.027 - 0.027 * Math.pow(1 - w * tw / 100, 2)); }

  var TABLE_WINDS = [-2, -1, 0, 1, 2, 3, 4];

  function parseWind(input) {
    if (input == null) return null;
    var s = String(input).trim().replace(",", ".").replace(/\s+/g, "").replace(/m\/?s$/i, "");
    if (!/^[+\-−]?\d+(\.\d+)?$/.test(s)) return null;
    return parseFloat(s.replace("−", "-"));
  }

  function compute(eventKey, time, wind, otherWind) {
    var ev = EVENTS[eventKey];
    if (!ev || !(time > 0) || wind == null || Math.abs(wind) > MAX_WIND) return null;
    var m = MODELS[ev.model];
    var still = m.still(time, wind);
    var rows = TABLE_WINDS.map(function (w) { return { wind: w, time: m.atWind(still, w) }; });
    return {
      event: ev, time: time, wind: wind, still: still, effect: time - still,
      legal: wind <= LEGAL_WIND,
      mureika: ev.model === "100" ? mureika100(time, wind) : null,
      other: otherWind != null && Math.abs(otherWind) <= MAX_WIND ? { wind: otherWind, time: m.atWind(still, otherWind) } : null,
      rows: rows
    };
  }

  function windText(w) {
    var s = SB.formatNum(Math.abs(w), 1);
    return (w > 0 ? "+" : w < 0 ? "−" : "") + s;
  }

  function stat(k, v, s, hero) {
    return '<div class="stat' + (hero ? " hero" : "") + '"><span class="k">' + k + '</span><output class="v">' + v + '</output><div class="s">' + s + "</div></div>";
  }

  // Pure: the results markup. Also used to write the page's static example.
  function view(res) {
    if (!res) {
      return '<p class="error">' + t("Enter a time and a wind between −4.0 and +4.0 m/s.", "Inserisci un tempo e un vento tra −4,0 e +4,0 m/s.") + "</p>";
    }
    var effect = res.effect;
    var effectText = Math.abs(effect) < 0.005 ? SB.formatNum(0, 2) : (effect < 0 ? "−" : "+") + SB.formatNum(Math.abs(effect), 2);
    var html = '<div class="stats">' +
      stat(t("Still-air time", "Tempo a vento zero"), SB.formatTime(res.still, 2), t("estimate at 0.0 m/s", "stima con 0,0 m/s"), true) +
      stat(t("Wind effect", "Effetto del vento"), effectText + " s",
        res.wind > 0 ? t("the tailwind helped", "il vento a favore ha aiutato") : res.wind < 0 ? t("the headwind cost time", "il vento contrario ha rallentato") : t("no wind", "nessun vento")) +
      stat(t("For records", "Per i record"), res.legal ? t("Legal", "Regolare") : t("Wind-assisted", "Ventoso"),
        res.legal ? t("wind at or below +2.0 m/s", "vento fino a +2,0 m/s") : t("wind above +2.0 m/s", "vento oltre +2,0 m/s")) +
      "</div>";

    if (res.other) {
      html += '<p class="note">' + t("At ", "Con ") + windText(res.other.wind) + " m/s" + t(" the same run is about ", " la stessa corsa vale circa ") +
        "<strong>" + SB.formatTime(res.other.time, 2) + "</strong>.</p>";
    }

    html += '<div class="table-wrap"><table><thead><tr><th>' + t("Wind (m/s)", "Vento (m/s)") + "</th>" +
      res.rows.map(function (r) { return "<th" + (r.wind === 0 ? ' class="hl"' : "") + ">" + windText(r.wind) + "</th>"; }).join("") +
      "</tr></thead><tbody><tr><td>" + res.event.name + "</td>" +
      res.rows.map(function (r) { return "<td" + (r.wind === 0 ? ' class="hl"' : "") + ">" + SB.formatTime(r.time, 2) + "</td>"; }).join("") +
      "</tr></tbody></table></div>";

    if (res.mureika != null) {
      html += '<p class="note">' + t("A physics model for the 100 m (Mureika, 2001) gives ", "Un modello fisico per i 100 m (Mureika, 2001) dà ") +
        SB.formatTime(res.mureika, 2) + t(" in still air.", " a vento zero.") + "</p>";
    }
    if (res.event.hurdles) {
      html += '<p class="note">' + t("Hurdle times stay hurdle times. This is not a flat 100 m equivalent.", "Un tempo con ostacoli resta un tempo con ostacoli. Non è un equivalente dei 100 m piani.") + "</p>";
    }
    return html;
  }

  function render() {
    var form = SB.$("#wind-form");
    var timeEl = form.elements.time, windEl = form.elements.wind, otherEl = form.elements.otherWind;
    var time = SB.parseTime(timeEl.value);
    var wind = parseWind(windEl.value);
    var other = otherEl.value.trim() === "" ? null : parseWind(otherEl.value);
    SB.invalid(timeEl, !(time > 0));
    SB.invalid(windEl, wind == null || Math.abs(wind) > MAX_WIND);
    SB.invalid(otherEl, otherEl.value.trim() !== "" && (other == null || Math.abs(other) > MAX_WIND));
    SB.$("#wind-results").innerHTML = view(compute(form.elements.event.value, time, wind, other));
  }

  SB.wind = { compute: compute, view: view, parseWind: parseWind, mureika100: mureika100, MODELS: MODELS };
  if (document.getElementById && document.getElementById("wind-form")) SB.bind("#wind-form", render);
})();
