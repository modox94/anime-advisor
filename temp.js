// пример результата поиска
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

/*
пример рекомендации
{
    pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/4/25196.jpg?s=f6d0dad0063c737fdca16c04e6e51cd9',
    animeLink: 'https://myanimelist.net/anime/365/Fake',
    anime: 'Fake',
    mainRecommendation: 'Fake and Zetsuai both deal with the problems that arise from a romantic relationship between two men. Fake is light hearted with a thriller related plot while Zetsuai is much visceral and dark, fans of one should be interested in the other, though.',
    author: 'Nocturnal'
  },
*/
/*
let url = 'https://myanimelist.net/anime/10495/Yuru_Yuri';
let reg = /^https:\/\/myanimelist\.net\/anime\/(\d+)\/\w+/gim;

let test = url.replace(reg, '$1');

// console.log(test);

let disc =
  "After a year in grade school without her childhood friends, first year student Akari Akaza is finally reunited with second years Yui Funami and Kyouko Toshinou at their all-girls' middle school. Durin...read more.";
let test2 = disc.replace('...read more.', '...');

console.log(test2);
*/
/*
[
  [],
  [],
  [
    {
      pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/7/85449.jpg?s=bac4b472a96d14d18e18dc5044ae1c92',
      animeLink: 'https://myanimelist.net/anime/1532/Suki_na_Mono_wa_Suki_Dakara_Shou_ga_Nai',
      anime: 'Suki na Mono wa Suki Dakara Shou ga Nai!!',
      mainRecommendation: 'also a tormented back story. easy to see, and more evolved relationship.\n' +
        'alike in sex scenes (there are, but only as fan service).',
      author: 'zinno-chan'
    },
    {
      pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/1/2443.jpg?s=411d2d09db5bc25a8b889e22e7822b4a',
      animeLink: 'https://myanimelist.net/anime/2238/Fuyu_no_Semi',
      anime: 'Fuyu no Semi',
      mainRecommendation: 'Fuyu no semi is one of the few animes within the yaoi genre that hit you on an emotional level this deep, other than ai no kusabi which i can see has already been recomended.\n' +
        '\n' +
        "So i recomend Zetsuai, a yaoi classic that came out in the early nighties this touching tale of forbiden love through the eyes of a man that feels nothing will tug at anyone's heart",
      author: 'mistressofyaoi'
    },
    {
      pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/2/22947.jpg?s=99987183430da9c125d0173a26a1a4c4',
      animeLink: 'https://myanimelist.net/anime/149/Loveless',
      anime: 'Loveless',
      mainRecommendation: 'Loveless is also an anime about an older man falling for a young boy who has had a traumatic life.',
      author: 'XyaoiX'
    },
    {
      pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/1/2413.jpg?s=10b7bcad1552850f4b675226f4b0d31c',
      animeLink: 'https://myanimelist.net/anime/2220/Be-Boy_Kidnappn_Idol',
      anime: "Be-Boy Kidnapp'n Idol",
      mainRecommendation: 'A music setting, shounen-ai and plenty of angst dominate Be-Boy and Zetsuai. In both we have a romantic relationship between a singer and a person not involved in the music business. Be-Boy is more light hearted, though, and has plenty of fluff while Zetsuai is virtually charged with extreme angst, dark pasts and plenty of emotional suffering.',
      author: 'Nocturnal'
    },
    {
      pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/4/21856.jpg?s=dbfb50db8c8b9bd3c7180262c7c535e8',
      animeLink: 'https://myanimelist.net/anime/243/Gravitation',
      anime: 'Gravitation',
      mainRecommendation: 'Yaoi, angst, and music: Gravitation and Zetsuai revolve around these themes. In both cases same gender relationships pose a dillemma to the protagonists as does dealing with a constant pressure that fame entails. Gravitation has a great deal of comedy elements that tone down the angsty mood, Zetsuai on the other hand is rather dark and takes angst to a paroxysms of a violent nature.',
      author: 'Nocturnal'
    },
    {
      pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/4/25196.jpg?s=f6d0dad0063c737fdca16c04e6e51cd9',
      animeLink: 'https://myanimelist.net/anime/365/Fake',
      anime: 'Fake',
      mainRecommendation: 'Fake and Zetsuai both deal with the problems that arise from a romantic relationship between two men. Fake is light hearted with a thriller related plot while Zetsuai is much visceral and dark, fans of one should be interested in the other, though.',
      author: 'Nocturnal'
    },
    {
      pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/8/6531.jpg?s=6bbea2d72346fbd62e8ffa26ccf1c6b8',
      animeLink: 'https://myanimelist.net/anime/719/Ai_no_Kusabi',
      anime: 'Ai no Kusabi',
      mainRecommendation: "Even though they are set in different times and their characters have a different relationship, Ai no Kusabi and Zetsuai/Bronze are really alike. Both are old school and  their artwork is gorgeous; all sex scenes are tasteful (not really explicit, and not vulgar) and both revolve about one person's obsession and desire to posses someone else. The relationship between the characters is deeper, more tortured and complicated than in any other yaoi anime I've seen .They are both 10/10 in my list!",
      author: 'yuuko'
    }
  ],
  [],
  [],
  [],
  [
    {
      pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/10/13776.jpg?s=59923e912c52be84eba47bd67c89d447',
      animeLink: 'https://myanimelist.net/anime/6211/Tokyo_Magnitude_80',
      anime: 'Tokyo Magnitude 8.0',
      mainRecommendation: "These two shows are similar in that they're both about major Japanese earthquakes, the difference is that Tokyo Magnitude 8.0 is good. They are both share the overall setting of a large earthquake causing mass destruction and loss. This leads the protagonists of both shows through some amount of journey through the decimated landscape. Also, both have the themes of the importance of family, friends and community. \n" +
        '\n' +
        "If you're looking more for the mission impossible wanna-be-badass journey Nihon Chinbotsu is for you. But if you wanna actually sympathize with some characters Tokyo Magnitude 8.0 is the one...I certainly felt more emotions while watching Tokyo Magnitude 8.0, take that information as you will (I think it had more to do with the weird pacing and direction taken in Nihon Chinbotsu 2020 because in theory, I should have cried more in that one than Magnitude 8.0) read more both simeler regurding erthquick and the servival after it with hartwarming story to follow in it. If you're lucky enough to check recommendations before watching the show, take my advice and watch Tokyo Magnitude 8.0 instead. \n" +
        '\n' +
        '"Japan sinks" is a very poorly made apocalypse-theme show that fails at everything:\n' +
        'poor plot, poorly developed and annoying characters, awful art and animation, awful atmosphere.\n' +
        '\n' +
        "100 times out of 100, I'd recommend Tokyo Magnitude 8.0 over this garbage. - Similar story about a strong earthquake hitting Japan and causing destruction\n" +
        '- Focus on a small group of people trying to survive in this natural disaster\n' +
        '- The main protagonists are older sister and younger brother \n' +
        '- Shows explore the hardships and psychological struggles of the main characters  \n' +
        '- The theme of family and friendship Both involve a earthquake striking japan and follows some family members (sister and her little brother) and others on their journey to a safe spot. Both animes feature an earthquake situation, where two siblings fight for survival throughout natural disasters. Although they sound strikingly similar, I feel Tokyo Magnitude 8.0 to be better developed than Japan Sinks 2020 because of its character depth. Japan Sinks 2020 characters felt brushed off with poor writing to the exception of some well-done scenes. \n' +
        'As a Masaki fan, I love his bizarre premises and being able to evoke human nature but I do feel as if the character writing here was one of his weaker works.',
      author: 'ddrcrono'
    },
    {
      pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/9/31905.jpg?s=46fee0726c1cca8cf9a628bfba3fdb00',
      animeLink: 'https://myanimelist.net/anime/10417/Gyo',
      anime: 'Gyo',
      mainRecommendation: 'They both depict a failing Japan in a similar poor plot.',
      author: 'marcospampixxx'
    },
    {
      pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/6/86733.jpg?s=56ac623880ec87f3a0197e0391bc12c3',
      animeLink: 'https://myanimelist.net/anime/34599/Made_in_Abyss',
      anime: 'Made in Abyss',
      mainRecommendation: 'Same morbid and realistic atmosphere to the show\nYoung main character',
      author: '_pieceofwood'
    },
    {
      pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/1943/95714.jpg?s=d30366b0e9d532812d3cef0aa8e48656',
      animeLink: 'https://myanimelist.net/anime/2915/Chikyuu_ga_Ugoita_Hi',
      anime: 'Chikyuu ga Ugoita Hi',
      mainRecommendation: 'Both animes relate to earthquakes. I found The Day The Earth Moved is a lot more realistic than Japan Sinks 2020, because Japan Sinks 2020 is more on the sci fi side.',
      author: 'Some1ridiculous'
    },
    {
      pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/5/50331.jpg?s=afd09d7e5d76283418a1a22e7c122ca9',
      animeLink: 'https://myanimelist.net/anime/1575/Code_Geass__Hangyaku_no_Lelouch',
      anime: 'Code Geass: Hangyaku no Lelouch',
      mainRecommendation: "Series that mainly deal with national identity and economics (as well as the oppression that can arise from both). Despite the heavy subject matter and grand, over-the-top tone of both works, they don't always take themselves too seriously, with some humorous scenes sprinkled throughout their intense storylines.",
      author: 'Kyotso'
    },
    {
      pictureImage: 'https://cdn.myanimelist.net/r/50x70/images/anime/1305/96703.jpg?s=dad7f4ab2bed3e26f6c63a10036535ab',
      animeLink: 'https://myanimelist.net/anime/38735/7_Seeds',
      anime: '7 Seeds',
      mainRecommendation: 'Surviving after the world has changed forever.',
      author: 'ceddie'
    }
  ]
]
*/

// const Jikan = require('jikan-node');
// const mal = new Jikan();
// const jikanjs = require('jikanjs');

// let temp;
// let temp2;
// async function start() {
//   console.log('start');
//   try {
//     temp = await jikanjs.loadAnime('849');
//     temp2 = await jikanjs.search('anime', 'yuru', 10);
//   } catch (err) {
//     console.log(err.message);
//   }
//   console.log('finish', temp);
// }
// start();
///recommendation

/*
bcrypt dotenv express express-session hbs jikanjs mal-scraper mongoose path rutracker-api session-file-store
*/

const tg = require('torrent-grabber');
require('dotenv').config();

const trackersToUse = [
  '1337x',
  'ThePirateBay',
  'Nnm',
  [
    'Rutracker',
    {
      login: process.env.RUTRACKER_LOGIN,
      pass: process.env.RUTRACKER_PASSWORD,
    },
  ],
];

tg.activate('ThePirateBay').then((name) => {
  console.log(`${name} is ready!`);

  tg.search('the greatest showman', {
    groupByTracker: false,
  }).then((items) => console.log(items));
});
