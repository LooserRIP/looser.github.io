let database;
async function init() {
  database = await fetch("https://wakeful-enchanted-theory.glitch.me/database");
  database = await database.json();
  document.getElementById("totalusers").innerText = "Total Users: " + database.users.length;
  var keys = Object.keys(database.attempts);
  var attemptVals = 0;
  var attemptAmt = 0;
  for(var ik = 0; ik < keys.length; ik++) {
    var kd = database.attempts[keys[ik]];
    for(var iv = 0; iv < kd.v.length; iv++) {
      attemptAmt++;
      attemptVals += kd.v[iv];
    }
  }
  document.getElementById("averageattempts").innerText = "Average Attempts: " + Math.round((attemptVals / attemptAmt) * 100) / 100;
  var keys = Object.keys(database.beats);
  var beatsVals = 0;
  var beatsAmt = 0;
  for(var ik = 0; ik < keys.length; ik++) {
    var kd = database.beats[keys[ik]];
    for(var iv = 0; iv < kd.v.length; iv++) {
      beatsAmt++;
      beatsVals += kd.v[iv];
    }
  }
  document.getElementById("beatpercentage").innerText = "Beat Percentage: " + Math.floor(beatsVals / beatsAmt * 100) + "%";
  document.getElementById("gamesplayed").innerText = "Games Played: " + beatsAmt;

  var days = Object.keys(database.beats);
  console.log(days);
  var graph_days = [];
  var graph_beatperc = [];
  var graph_played = [];

  for (var id = days.length - 1; id >= 0; id--) {
    var day = days[id] - 100;
    console.log(day);
    var kd = database.beats[days[id]];
    var beatsVals = 0;
    var beatsAmt = 0;
    for(var iv = 0; iv < kd.v.length; iv++) {
      beatsAmt++;
      beatsVals += kd.v[iv];
    }
    var ka = database.attempts[days[id]];
    var attemptVals = 0;
    var attemptAmt = 0;
    if (ka != undefined) {
      for(var ia = 0; ia < ka.v.length; ia++) {
        attemptAmt++;
        attemptVals += ka.v[ia];
      }
    } else {var attemptAmt = 1;}
    var dayelm = document.createElement("DIV");
    dayelm.className = "day";
    var color = generateColor(day);
    var innerhtml = '<div class="daynum"><p class="daynumtxt">Day #REPLACE_DAY </p><p class="daycolor" style="color: #FFFFFF"> (REPLACE_COLOR)</p></div><p class="gamesplayed">Played REPLACE_GAMES games.</p><p class="beatperc">REPLACE_BEATPERC Beat percentage.</p><p class="averageattempts">REPLACE_AVERAGEATTEMPTS Average attempts</p>';
    innerhtml = innerhtml.replaceAll("REPLACE_COLOR", color).replace("REPLACE_DAY", (day - 18990)).replace("REPLACE_GAMES", beatsAmt).replace("REPLACE_BEATPERC", Math.floor(beatsVals / beatsAmt * 100) + "%").replace("REPLACE_AVERAGEATTEMPTS", Math.round((attemptVals / attemptAmt) * 100) / 100);
    if (id < days.length - 2) innerhtml = innerhtml.replace("color: #FFFFFF", "color: " + color);
    graph_beatperc.unshift(Math.floor(beatsVals / beatsAmt * 100));
    graph_played.unshift(beatsAmt);
    graph_days.unshift("Day " + (day - 18990));
    dayelm.innerHTML = innerhtml;
    document.getElementById("days").appendChild(dayelm);
  }
  var graphlink = "https://quickchart.io/chart/render/zm-0dedf14f-8028-4d26-aedd-d90b43389ae1?labels=" + graph_days.join(",") + "&data1=" + graph_played.join(",");
  var graphlink2 = "https://quickchart.io/chart/render/zm-9c3594e8-e613-4f7d-bdc0-4692bc4d494b?labels=" + graph_days.join(",") + "&data1=" + graph_beatperc.join(",");
  document.getElementById("graph_games").setAttribute("src", graphlink);
  document.getElementById("graph_beatperc").setAttribute("src", graphlink2);

}




function generateColor(days) {
  var colorgoalhue = randomInt(0, 9, days) * 36;
  var colorgoalsatur = randomInt(0, 10, days + 500) * 0.1;
  var colorgoalbright = randomInt(0, 10, days + 1000) * 0.1;
  return hsvToHex(colorgoalhue, colorgoalsatur, colorgoalbright);
}
function randomInt(min, max, seed) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(mulberry32(seed)() * (max - min + 1)) + min;
}
function mulberry32(a) {
  return function() {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


function hsvToHex(hue, saturation, value) {
  var rgb = hsvToRgb(hue, saturation, value);
  return rgbToHex(Math.floor(rgb[0] * 255), Math.floor(rgb[1] * 255), Math.floor(rgb[2] * 255));
}
function hsvToRgb2(hue, saturation, value) {
  var rgb = hsvToRgb(hue, saturation, value);
  return [Math.floor(rgb[0] * 255), Math.floor(rgb[1] * 255), Math.floor(rgb[2] * 255)];
}
function hsvToRgb(h,s,v) 
{                              
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5),f(3),f(1)];       
}   

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}