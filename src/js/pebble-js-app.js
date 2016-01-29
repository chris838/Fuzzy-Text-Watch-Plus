// Watchface version * 10 (3.4 becomes 34)
var version=35;

Pebble.addEventListener('ready', function() {
  console.log('PebbleKit JS ready!');
});

Pebble.addEventListener('showConfiguration', function() {
  var url = 'http://fuzzytextconfig-sarastro.rhcloud.com/config/index.html?v=' + version;
  //url = 'file:///Users/mattias/gitroot/private/Fuzzy-Text-watch-Plus/config/index.html?v=' + version;

  if (getWatchVersion() < 3) { // Black n white
    url = url + "&bw";
  }

  console.log('Showing configuration page: ' + url);

  Pebble.openURL(url);
});

Pebble.addEventListener('webviewclosed', function(e) {
  var configData = JSON.parse(decodeURIComponent(e.response));
  console.log('Configuration page returned: ' + JSON.stringify(configData));

  var dict = {};
  // Inverse BW colors
  dict['KEY_INVERSE'] = configData['inverse_colors'] ? 1 : 0;  // Send a boolean as an integer
  // Background color
  var argb = hexColorToARGB2222(configData['background_color']);
  if (argb > 0) dict['KEY_BACKGROUND'] = argb;
  // Regular text color
  argb = hexColorToARGB2222(configData['regular_color']);
  if (argb > 0) dict['KEY_REGULAR_TEXT'] = argb;
  // Bold text color
  argb = hexColorToARGB2222(configData['bold_color']);
  if (argb > 0) dict['KEY_BOLD_TEXT'] = argb;

  // Language
  var lang = configData['language'];
  if (lang > 0) dict['KEY_LANGUAGE'] = parseInt(lang);

  // Time offset
  var offset = configData['offset'];
  if (offset !== undefined) dict['KEY_OFFSET'] = parseInt(offset);

  // Alignment
  var alignment = configData['alignment'];
  if (alignment !== undefined) dict['KEY_ALIGNMENT'] = parseInt(alignment);

  // Send to watchapp
  Pebble.sendAppMessage(dict, function() {
    console.log('Send successful: ' + JSON.stringify(dict));
  }, function(e) {
    console.log('Send failed! ' + JSON.stringify(e) + ', ' + JSON.stringify(dict));
  });
});

function hexColorToARGB2222(color) {
  if (color.length == 8) { // Expect "0xRRGGBB"
    var r = parseInt(color.substring(2,3), 16) >> 2;
    var g = parseInt(color.substring(4,5), 16) >> 2;
    var b = parseInt(color.substring(6,7), 16) >> 2;

    var col = 3;  //alpha
    col = (col << 2) + r;
    col = (col << 2) + g;
    col = (col << 2) + b;
    return col;
  }

  return 0;
}

function getWatchVersion() {
  // 1 = Pebble OG
  // 2 = Pebble Steel
  // 3 = Pebble Time
  // 4 = Pebble Time Steel
  // 5 = Pebble Time Round

  var watch_version = 1;
 
  if(Pebble.getActiveWatchInfo) {
    // Available for use!
    var watch_name = Pebble.getActiveWatchInfo().model;
 
    if (watch_name.indexOf("pebble_time_steel") >= 0) {
      watch_version = 4;
    } else if (watch_name.indexOf("pebble_time_round") >= 0) {
      watch_version = 5;
    } else if (watch_name.indexOf("qemu_platform_chalk") >= 0) {
      watch_version = 5;
    } else if (watch_name.indexOf("pebble_time") >= 0) {
      watch_version = 3;
    } else if (watch_name.indexOf("qemu_platform_basalt") >= 0) {
      watch_version = 3;
    } else if (watch_name.indexOf("pebble_steel") >= 0) {
      watch_version = 2;
    }
  }
  
  return watch_version;
}