const nFormatter = (num, digits) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find((e) => num >= e.value);
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
};

const timeAgoFormatter = (datetime) => {
  const createdTime = new Date(datetime);
  const nowTime = Date.now();
  const differenceInTime = Math.abs(nowTime - createdTime.getTime()) / 1000;
  // To calculate the no. of days between two dates
  let interval = differenceInTime / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} y`;
  }
  interval = differenceInTime / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} mo`;
  }
  interval = differenceInTime / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} d`;
  }
  interval = differenceInTime / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} h`;
  }
  interval = differenceInTime / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} min`;
  }
  return 'Just Now';
};

export { nFormatter, timeAgoFormatter };
