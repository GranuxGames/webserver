const RPG_LENGTH_CONVERSION_TABLE = {
  'twip': 1/17280,
  'thou': 1/12000,
  'thous': 1/12000,
  'th': 1/12000,
  'ths': 1/12000,
  'mil': 1/12000,
  'mils': 1/12000,
  'barleycorn': 1/36,
  'barleycorns': 1/36,
  'barley corn': 1/36,
  'barley cornes': 1/36,
  'inch': 1/12,
  'inches': 1/12,
  'in': 1/12,
  'ins': 1/12,
  '\'\'': 1/12,
  'hand': 1/3,
  'hands': 1/3,
  'h': 1/3,
  'hs': 1/3,
  'hh': 1/3,
  'hhs': 1/3,
  'ft': 1,
  'foot': 1,
  'feet': 1,
  '\'': 1,
  'yard': 3,
  'yards': 3,
  'yd': 3,
  'yds': 3,
  'chain': 66,
  'chains': 66,
  'ch': 66,
  'chs': 66,
  'furlong': 660,
  'furlongs': 660,
  'fur': 660,
  'furs': 660,
  'mile': 5280,
  'miles': 5280,
  'mi': 5280,
  'mis': 5280,
  'league': 15840,
  'leagues': 15840,
  'lea': 15840,
  'leas': 15840
};

const RPG_TIME_CONVERSION_TABLE = {
  'second': 1/6,
  'seconds': 1/6,
  's': 1/6,
  'turn': 1,
  'turns': 1,
  'minute': 10,
  'minutes': 10,
  'min': 10,
  'mins': 10,
  'hour': 600,
  'hours': 600,
  'h': 600,
  'hs': 600,
  'hr': 600,
  'hrs': 600,
  'day': 14400,
  'days': 14400,
  'd': 14400,
  'ds': 14400,
  'week': 100800,
  'weeks': 100800,
  'w': 100800,
  'ws': 100800,
  'month': 432000,
  'months': 432000,
  'year': 5256000,
  'years': 5256000,
  'y': 5256000,
  'ys': 5256000,
  'yr': 5256000,
  'yrs': 5256000
}

function convertRPGLength(value) {
  return convertUnits(value, RPG_LENGTH_CONVERSION_TABLE);
}

function convertRPGTime(value) {
  return convertUnits(value, RPG_TIME_CONVERSION_TABLE);
}

function convertUnits(value, table) {
  value = value.trim().toLowerCase();

  if (value.length <= 0)
    return -1;

  var number = value.match(/^-?(\d+\.?\d*|\d*\.?\d+)/gm);
  if (number == null)
    return -1;
  number = number[0];

  value = value.substring(number.length).trim();
  number = Number.parseFloat(number);

  for (var unit of Object.keys(table)) {
    if (unit.toLowerCase() == value.toLowerCase() || unit.toLowerCase() + '.' == value.toLowerCase()) {
      return number * table[unit];
    }
  }

  return -1;
}