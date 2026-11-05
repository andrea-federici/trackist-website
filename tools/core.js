/*
  Track tools: shared helpers for every calculator page.

  First-party and inert in the sense AGENTS.md means: no request, no cookie,
  no storage, no third party, nothing recorded about the visitor. Every page
  also carries a worked result in its HTML, so it still says something useful
  if this never runs.
*/
(function () {
  "use strict";

  var requestedLanguage = (document.documentElement.lang || "en").toLowerCase().split(/[-_]/)[0];
  var lang = ["en", "it", "es", "fr"].indexOf(requestedLanguage) >= 0 ? requestedLanguage : "en";

  // Page translations use the same calculator formulas and result templates.
  var translations = {
  "es": {
    " + cut in": " + calle libre",
    " events scored": " pruebas puntuadas",
    " in ": " en ",
    " in still air.": " sin viento.",
    " lap": " vuelta",
    " of ": " de ",
    " of recovery": " de recuperación",
    " on the first half": " en la primera mitad",
    " points in each event left. Any mix of marks with the same total works.": " puntos en cada prueba pendiente. Cualquier combinación con el mismo total sirve.",
    " the same run is about ": " la misma carrera sería aproximadamente ",
    ". Each cell is the time for one rep.": ". Cada celda es el tiempo de una repetición.",
    "1 mile": "1 milla",
    "1.06 is Riegel's value": "1.06 es el valor de Riegel",
    "100 m": "100 m",
    "100 m hurdles": "100 m vallas",
    "1000 m": "1000 m",
    "110 m hurdles": "110 m vallas",
    "1500 m": "1500 m",
    "2 miles": "2 millas",
    "200 m": "200 m",
    "400 m": "400 m",
    "400 m stagger, lane ": "Compensación de 400 m, calle ",
    "50 laps is a long table, so it shows every second lap.": "50 vueltas dan una tabla larga, así que se muestra una de cada dos.",
    "60 m": "60 m",
    "60 m hurdles": "60 m vallas",
    "800 m": "800 m",
    "A physics model for the 100 m (Mureika, 2001) gives ": "Un modelo físico de 100 m (Mureika, 2001) da ",
    "Added": "Añadido",
    "Against target": "Frente al objetivo",
    "An estimate for comparing marks. A converted time is not valid for records, rankings that require FAT, or qualifying.": "Una estimación para comparar marcas. Un tiempo convertido no sirve para récords, clasificaciones que exigen FAT ni mínimas.",
    "At ": "Con ",
    "At this pace": "A este ritmo",
    "Average": "Media",
    "Average pace": "Ritmo medio",
    "Before rounding": "Antes de redondear",
    "Combined events": "Pruebas combinadas",
    "Convention": "Convención",
    "Could not read the mark for: ": "No se ha podido leer la marca de: ",
    "Difference": "Diferencia",
    "Discus": "Disco",
    "Distance": "Distancia",
    "Enter a PB time, like 4:10.00 for 1500 m.": "Introduce un tiempo de PB, como 4:10.00 para 1500 m.",
    "Enter a lane width between 1.00 and 1.30 m.": "Introduce una anchura de calle de 1.00 a 1.30 m.",
    "Enter a mark.": "Introduce una marca.",
    "Enter a pace or a speed.": "Introduce un ritmo o velocidad.",
    "Enter a target time like 2:00.00.": "Introduce un tiempo objetivo, como 2:00.00.",
    "Enter a time and a wind between −4.0 and +4.0 m/s.": "Introduce un tiempo y un viento entre −4.0 y +4.0 m/s.",
    "Enter a time, like 10.8.": "Introduce un tiempo, como 10.8.",
    "Enter a time, like 4:10.00.": "Introduce un tiempo, como 4:10.00.",
    "Enter two PBs at different distances.": "Introduce dos PB de distancias diferentes.",
    "Enter your PB time, like 2:00.00.": "Introduce tu tiempo de PB, como 2:00.00.",
    "Estimate": "Estimación",
    "Event": "Prueba",
    "Exact inches": "Pulgadas exactas",
    "Exponent": "Exponente",
    "Extra per lane": "Extra por calle",
    "FAT estimate": "Estimación FAT",
    "FAT time": "Tiempo FAT",
    "FAT time − ": "Tiempo FAT − ",
    "Factor": "Factor",
    "Feet and inches": "Pies y pulgadas",
    "First half": "Primera mitad",
    "For records": "Para récords",
    "For target": "Para el objetivo",
    "For target: the mark that scores ": "Para el objetivo: la marca que da ",
    "Half marathon": "Media maratón",
    "Hand estimate": "Estimación manual",
    "Hand time": "Tiempo manual",
    "Hand time as recorded": "Tiempo manual registrado",
    "Hand time estimate": "Estimación de tiempo manual",
    "Hand times: 0.24 s is added below 400 m and 0.14 s at 400 m before scoring.": "Tiempos manuales: se añaden 0.24 s por debajo de 400 m y 0.14 s en 400 m antes de puntuar.",
    "High jump": "Salto de altura",
    "Hurdle times stay hurdle times. This is not a flat 100 m equivalent.": "Los tiempos de vallas siguen siendo de vallas. No es un equivalente de 100 m lisos.",
    "Javelin": "Jabalina",
    "Lane": "Calle",
    "Lane ": "Calle ",
    "Legal": "Válido",
    "Long jump": "Salto de longitud",
    "Marathon": "Maratón",
    "Mark": "Marca",
    "Metres": "Metros",
    "Mile": "Milla",
    "Note": "Nota",
    "One lap": "Una vuelta",
    "PB pace": "Ritmo de PB",
    "Pace /400 m": "Ritmo /400 m",
    "Per 100 m": "Por 100 m",
    "Per event left": "Por prueba pendiente",
    "Per km": "Por km",
    "Points": "Puntos",
    "Pole vault": "Salto con pértiga",
    "Reps": "Repeticiones",
    "Riegel, exponent 1.06": "Riegel, exponente 1.06",
    "Rough means the formula is outside the range where it works well: below 400 m, or more than 4 times longer or shorter than your PB.": "Aproximado indica que la fórmula sale de su rango útil: menos de 400 m, o distancias más de 4 veces mayores o menores que tu PB.",
    "Rough: far from PB": "Aproximado: lejos del PB",
    "Rough: sprint": "Aproximado: velocidad",
    "Running time": "Tiempo de carrera",
    "Same pace": "Mismo ritmo",
    "Same pace is the time if you held exactly the same pace over the other distance. The estimate allows for pace dropping as a race gets longer, so it is the one to use.": "Mismo ritmo indica el tiempo si mantuvieras exactamente el ritmo en la otra distancia. La estimación tiene en cuenta que el ritmo baja al alargarse la carrera, por eso es la que conviene usar.",
    "Second half": "Segunda mitad",
    "Segment": "Tramo",
    "Segment time": "Tiempo del tramo",
    "Shot put": "Lanzamiento de peso",
    "Skipped, could not read: ": "Omitido, no se ha podido leer: ",
    "Slow-down": "Pérdida de ritmo",
    "Split": "Parcial",
    "Staggers in metres ahead of lane 1. 800 m: in lanes for one bend. 4×400: in lanes for three bends. Both then cut in at the break line.": "Compensaciones en metros por delante de la calle 1. 800 m: una curva por calles. 4×400: tres curvas por calles. Después, calle libre en la línea de calle libre.",
    "Statistics (T&amp;F News)": "Estadística (T&amp;F News)",
    "Still needed": "Faltan",
    "Still-air time": "Tiempo sin viento",
    "Taken off": "Restado",
    "Target": "Objetivo",
    "This exponent is far from Riegel's 1.06. Check that both PBs are recent and correct.": "Este exponente se aleja del 1.06 de Riegel. Comprueba que ambos PB sean recientes y correctos.",
    "Time": "Tiempo",
    "Time at this pace": "Tiempo a este ritmo",
    "Total": "Total",
    "Total volume": "Volumen total",
    "US high school (NFHS)": "Centros escolares de EE. UU. (NFHS)",
    "Use an exponent between 0.9 and 1.3.": "Usa un exponente entre 0.9 y 1.3.",
    "Wind (m/s)": "Viento (m/s)",
    "Wind effect": "Efecto del viento",
    "Wind-assisted": "Con viento no válido",
    "Write a session like 6x200 in 27-28.": "Escribe un entrenamiento como 6x200 en 27-28.",
    "Your PB": "Tu PB",
    "Your PB: ": "Tu PB: ",
    "Your exponent": "Tu exponente",
    "ahead of lane 1": "por delante de la calle 1",
    "already in tenths": "ya en décimas",
    "as on the result": "como en el resultado",
    "at 100%": "al 100%",
    "before rounding": "antes de redondear",
    "bend": "curva",
    "bends": "curvas",
    "each lap, lanes 2 and out": "cada vuelta, desde la calle 2",
    "estimate at 0.0 m/s": "estimación con 0.0 m/s",
    "estimate from ": "estimación desde ",
    "even pace": "ritmo regular",
    "fitted from your two PBs": "calculado a partir de tus dos PB",
    "half mile": "media milla",
    "hand time + ": "tiempo manual + ",
    "if you stayed in the lane": "si mantienes la calle",
    "mile": "milla",
    "no wind": "sin viento",
    "none": "nada",
    "not counting recovery": "sin contar la recuperación",
    "nothing": "nada",
    "of fast running": "de carrera rápida",
    "pace each time the distance doubles": "del ritmo cada vez que se dobla la distancia",
    "per 400 m": "por 400 m",
    "per 400 m = 100%": "por 400 m = 100%",
    "plus ": "más ",
    "points": "puntos",
    "points for ": "puntos para ",
    "points on average": "puntos de media",
    "points per event": "puntos por prueba",
    "rounded down to the ¼ inch": "redondeado hacia abajo a ¼ de pulgada",
    "rounded up from ": "redondeado hacia arriba desde ",
    "rounded up to the tenth": "redondeado a la décima superior",
    "the headwind cost time": "el viento en contra hizo perder tiempo",
    "the tailwind helped": "el viento a favor ayudó",
    "wind above +2.0 m/s": "viento superior a +2.0 m/s",
    "wind at or below +2.0 m/s": "viento de +2.0 m/s o menos"
  },
  "fr": {
    " + cut in": " + rabattement",
    " events scored": " épreuves comptabilisées",
    " in ": " en ",
    " in still air.": " sans vent.",
    " lap": " tour",
    " of ": " sur ",
    " of recovery": " de récupération",
    " on the first half": " sur la première moitié",
    " points in each event left. Any mix of marks with the same total works.": " points dans chaque épreuve restante. Toute combinaison avec le même total convient.",
    " the same run is about ": " la même course donne environ ",
    ". Each cell is the time for one rep.": ". Chaque case indique le temps d'une répétition.",
    "1 mile": "1 mile",
    "1.06 is Riegel's value": "1.06 est la valeur de Riegel",
    "100 m": "100 m",
    "100 m hurdles": "100 m haies",
    "1000 m": "1000 m",
    "110 m hurdles": "110 m haies",
    "1500 m": "1500 m",
    "2 miles": "2 miles",
    "200 m": "200 m",
    "400 m": "400 m",
    "400 m stagger, lane ": "Décalage du 400 m, couloir ",
    "50 laps is a long table, so it shows every second lap.": "50 tours donnent un long tableau ; un tour sur deux est affiché.",
    "60 m": "60 m",
    "60 m hurdles": "60 m haies",
    "800 m": "800 m",
    "A physics model for the 100 m (Mureika, 2001) gives ": "Un modèle physique du 100 m (Mureika, 2001) donne ",
    "Added": "Ajout",
    "Against target": "Par rapport à l'objectif",
    "An estimate for comparing marks. A converted time is not valid for records, rankings that require FAT, or qualifying.": "Une estimation pour comparer des performances. Un temps converti n'est pas valable pour les records, classements exigeant le FAT ou qualifications.",
    "At ": "Avec ",
    "At this pace": "À cette allure",
    "Average": "Moyenne",
    "Average pace": "Allure moyenne",
    "Before rounding": "Avant arrondi",
    "Combined events": "Épreuves combinées",
    "Convention": "Convention",
    "Could not read the mark for: ": "Impossible de lire la performance de : ",
    "Difference": "Différence",
    "Discus": "Disque",
    "Distance": "Distance",
    "Enter a PB time, like 4:10.00 for 1500 m.": "Saisis un temps de PB, par exemple 4:10.00 sur 1500 m.",
    "Enter a lane width between 1.00 and 1.30 m.": "Saisis une largeur de couloir de 1.00 à 1.30 m.",
    "Enter a mark.": "Saisis une performance.",
    "Enter a pace or a speed.": "Saisis une allure ou une vitesse.",
    "Enter a target time like 2:00.00.": "Saisis un temps cible, par exemple 2:00.00.",
    "Enter a time and a wind between −4.0 and +4.0 m/s.": "Saisis un temps et un vent entre −4.0 et +4.0 m/s.",
    "Enter a time, like 10.8.": "Saisis un temps, par exemple 10.8.",
    "Enter a time, like 4:10.00.": "Saisis un temps, par exemple 4:10.00.",
    "Enter two PBs at different distances.": "Saisis deux PB sur des distances différentes.",
    "Enter your PB time, like 2:00.00.": "Saisis ton temps de PB, par exemple 2:00.00.",
    "Estimate": "Estimation",
    "Event": "Épreuve",
    "Exact inches": "Pouces exacts",
    "Exponent": "Exposant",
    "Extra per lane": "Supplément par couloir",
    "FAT estimate": "Estimation FAT",
    "FAT time": "Temps FAT",
    "FAT time − ": "Temps FAT − ",
    "Factor": "Coefficient",
    "Feet and inches": "Pieds et pouces",
    "First half": "Première moitié",
    "For records": "Pour les records",
    "For target": "Pour l'objectif",
    "For target: the mark that scores ": "Pour l'objectif : la performance qui rapporte ",
    "Half marathon": "Semi-marathon",
    "Hand estimate": "Estimation manuelle",
    "Hand time": "Temps manuel",
    "Hand time as recorded": "Temps manuel noté",
    "Hand time estimate": "Estimation de temps manuel",
    "Hand times: 0.24 s is added below 400 m and 0.14 s at 400 m before scoring.": "Temps manuels : ajout de 0.24 s sous 400 m et de 0.14 s sur 400 m avant le calcul des points.",
    "High jump": "Saut en hauteur",
    "Hurdle times stay hurdle times. This is not a flat 100 m equivalent.": "Les temps de haies restent des temps de haies. Ce n'est pas un équivalent de 100 m plat.",
    "Javelin": "Javelot",
    "Lane": "Couloir",
    "Lane ": "Couloir ",
    "Legal": "Régulier",
    "Long jump": "Saut en longueur",
    "Marathon": "Marathon",
    "Mark": "Performance",
    "Metres": "Mètres",
    "Mile": "Mile",
    "Note": "Note",
    "One lap": "Un tour",
    "PB pace": "Allure du PB",
    "Pace /400 m": "Allure /400 m",
    "Per 100 m": "Par 100 m",
    "Per event left": "Par épreuve restante",
    "Per km": "Par km",
    "Points": "Points",
    "Pole vault": "Saut à la perche",
    "Reps": "Répétitions",
    "Riegel, exponent 1.06": "Riegel, exposant 1.06",
    "Rough means the formula is outside the range where it works well: below 400 m, or more than 4 times longer or shorter than your PB.": "Approximatif signifie que la formule sort de sa plage utile : sous 400 m, ou pour une distance plus de 4 fois plus longue ou plus courte que ton PB.",
    "Rough: far from PB": "Approximatif : loin du PB",
    "Rough: sprint": "Approximatif : sprint",
    "Running time": "Temps de course",
    "Same pace": "Même allure",
    "Same pace is the time if you held exactly the same pace over the other distance. The estimate allows for pace dropping as a race gets longer, so it is the one to use.": "Même allure indique le temps en gardant exactement la même allure sur l'autre distance. L'estimation tient compte du ralentissement quand la course s'allonge ; c'est donc celle à utiliser.",
    "Second half": "Seconde moitié",
    "Segment": "Segment",
    "Segment time": "Temps du segment",
    "Shot put": "Lancer du poids",
    "Skipped, could not read: ": "Ignoré, impossible à lire : ",
    "Slow-down": "Ralentissement",
    "Split": "Temps de passage",
    "Staggers in metres ahead of lane 1. 800 m: in lanes for one bend. 4×400: in lanes for three bends. Both then cut in at the break line.": "Décalages en mètres d'avance sur le couloir 1. 800 m : un virage en couloir. 4×400 : trois virages en couloir. Puis rabattement après la ligne correspondante.",
    "Statistics (T&amp;F News)": "Statistiques (T&amp;F News)",
    "Still needed": "Encore nécessaires",
    "Still-air time": "Temps sans vent",
    "Taken off": "Retrait",
    "Target": "Objectif",
    "This exponent is far from Riegel's 1.06. Check that both PBs are recent and correct.": "Cet exposant s'éloigne du 1.06 de Riegel. Vérifie que les deux PB sont récents et corrects.",
    "Time": "Temps",
    "Time at this pace": "Temps à cette allure",
    "Total": "Total",
    "Total volume": "Volume total",
    "US high school (NFHS)": "Lycées américains (NFHS)",
    "Use an exponent between 0.9 and 1.3.": "Utilise un exposant entre 0.9 et 1.3.",
    "Wind (m/s)": "Vent (m/s)",
    "Wind effect": "Effet du vent",
    "Wind-assisted": "Vent trop favorable",
    "Write a session like 6x200 in 27-28.": "Écris une séance comme 6x200 en 27-28.",
    "Your PB": "Ton PB",
    "Your PB: ": "Ton PB : ",
    "Your exponent": "Ton exposant",
    "ahead of lane 1": "d'avance sur le couloir 1",
    "already in tenths": "déjà en dixièmes",
    "as on the result": "comme dans les résultats",
    "at 100%": "à 100 %",
    "before rounding": "avant arrondi",
    "bend": "virage",
    "bends": "virages",
    "each lap, lanes 2 and out": "par tour, à partir du couloir 2",
    "estimate at 0.0 m/s": "estimation à 0.0 m/s",
    "estimate from ": "estimation à partir de ",
    "even pace": "allure régulière",
    "fitted from your two PBs": "calculé à partir de tes deux PB",
    "half mile": "demi-mile",
    "hand time + ": "temps manuel + ",
    "if you stayed in the lane": "si tu restes dans le couloir",
    "mile": "mile",
    "no wind": "sans vent",
    "none": "aucune",
    "not counting recovery": "sans compter la récupération",
    "nothing": "rien",
    "of fast running": "de course rapide",
    "pace each time the distance doubles": "d'allure chaque fois que la distance double",
    "per 400 m": "par 400 m",
    "per 400 m = 100%": "par 400 m = 100 %",
    "plus ": "plus ",
    "points": "points",
    "points for ": "points pour ",
    "points on average": "points en moyenne",
    "points per event": "points par épreuve",
    "rounded down to the ¼ inch": "arrondi au quart de pouce inférieur",
    "rounded up from ": "arrondi au dixième supérieur depuis ",
    "rounded up to the tenth": "arrondi au dixième supérieur",
    "the headwind cost time": "le vent contraire a coûté du temps",
    "the tailwind helped": "le vent favorable a aidé",
    "wind above +2.0 m/s": "vent supérieur à +2.0 m/s",
    "wind at or below +2.0 m/s": "vent de +2.0 m/s ou moins"
  }
};

  function t(en, it) {
    if (lang === "it") return it;
    if ((lang === "es" || lang === "fr") && /^\d+\.\d+$/.test(en)) return en.replace(".", ",");
    return translations[lang] && Object.prototype.hasOwnProperty.call(translations[lang], en) ? translations[lang][en] : en;
  }

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
    var parts = s.split(/\s*[-–—]\s*|\s+to\s+|\s+a\s+|\s+à\s+/i);
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
    var m = s.match(/^(\d+(?:\.\d+)?)?(m|k|km|mi|mile|miles|miglio|miglia|milla|millas)?$/);
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
    return x.toLocaleString({ en: "en-GB", it: "it-IT", es: "es-ES", fr: "fr-FR" }[lang], { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 });
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

  // The language menu is a <details>: close it on a click outside it or on Escape.
  document.addEventListener("click", function (e) {
    document.querySelectorAll("details.lang-menu[open]").forEach(function (d) { if (!d.contains(e.target)) d.open = false; });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll("details.lang-menu[open]").forEach(function (d) { d.open = false; d.querySelector("summary").focus(); });
  });

  window.SB = {
    lang: lang, t: t, MILE: MILE,
    parseTime: parseTime, parseRange: parseRange, parseDistance: parseDistance,
    formatTime: formatTime, formatPace: formatPace, formatNum: formatNum, formatDistance: formatDistance,
    $: $, $all: $all, bind: bind, invalid: invalid, esc: esc
  };
})();
