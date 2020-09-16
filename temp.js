// endDate: '09-20-11';
// members: '263,708';
// nbEps: '12';
// rating: 'PG-13';
// score: '7.61';
// shortDescription: "After a year in grade school without her childhood friends, first year student Akari Akaza is finally reunited with second years Yui Funami and Kyouko Toshinou at their all-girls' middle school. Durin...read more.";
// startDate: '07-05-11';
// thumbnail: 'https://cdn.myanimelist.net/r/100x140/images/anime/12/75173.jpg?s=d52b3768909b1c95e05011759d68b84c';
// title: 'Yuru Yuri';
// type: 'TV';
// url: 'https://myanimelist.net/anime/10495/Yuru_Yuri';
// video: 'https://myanimelist.net/anime/10495/Yuru_Yuri/video';

let url = 'https://myanimelist.net/anime/10495/Yuru_Yuri';
let reg = /^https:\/\/myanimelist\.net\/anime\/(\d+)\/\w+/gim;

let test = url.replace(reg, '$1');

// console.log(test);

let disc =
  "After a year in grade school without her childhood friends, first year student Akari Akaza is finally reunited with second years Yui Funami and Kyouko Toshinou at their all-girls' middle school. Durin...read more.";
let test2 = disc.replace('...read more.', '...');

console.log(test2);
