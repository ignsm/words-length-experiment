const short_words = 'bard,code,brute,dell,air,square,bloom,dawn,chief,breeze,gift,golf,sky,noose,stub,lumb,spray,stain,cash,boss,slave,lice,queen,steam,crag,storm,beast,wife,camp,fowl,lad,bronze,gem,coast,church,rod,street,brain,cell,slush,dirt,dust,jail,fur,vest,star,suds,nun,sauce,gold,sea,seat,inn,peach,tool,blood,lark,bar,girl,keg,tank,ink,moss,board,child,soil,claw,dove,oats,bowl,coin,corn,pipe,string,cane,toast,cord,limb,pole,boy'.split(',');
const long_words = 'beverage,colony,headquarters,performer,procession,property,retailer,wholesaler,acrobat,admiral,committee,gentlemen,instrument,islander,officer,passageway,appliance,avenue,gallery,instructor,nursery,opium,prisoner,vehicle,cobblestone,hurricane,musician,newspaper,orchestra,pianist,photograph,professor,animal,grandmother,hospital,magazine,medallion,physician,policeman,utensil,alcohol,factory,furniture,kerosene,library,restaurant,tobacco,volcano,ambulance,butterfly,daffodil,diamond,lemonade,mosquito,revolver,tablespoon,decoration,elephant,malaria,microscope,potato,strawberry,umbrella,vaccination,ambassador,bacteria,evangelist,infirmary,inhabitant,material,proprietor,prosecutor,accordion,alligator,amplifier,automobile,macaroni,refrigerator,university,vegetable'.split(',');

console.log('Short words: ' + short_words.length);
console.log('Long words: ' + long_words.length);

function getRandomSubset(arr, n) {
  shuffleArray(arr);
  return arr.slice(0, n);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function createExperiment() {
  const words = [];
  for (let i = 0; i < 15; i++) { // TODO: set from query
    words.push(getRandomSubset(short_words, 6));
    words.push(getRandomSubset(long_words, 6));
  }
  shuffleArray(words);
  return words;
}

module.exports = createExperiment;
