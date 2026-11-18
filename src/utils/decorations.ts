// Collection de bordures, décors et ornements textuels
export interface DecorationItem {
  id: string;
  name: string;
  category: 'cadres' | 'separateurs' | 'ornements' | 'symboles';
  pattern: string;
}

export const DECORATIONS: DecorationItem[] = [
  // Cadres et Bannières avec Placeholder
  {
    id: 'frame-1',
    name: 'Cadre Étoilé',
    category: 'cadres',
    pattern: '╔═════¦✵ Titre ✵¦═════╗\n  ...\n╚═════════════════════╝',
  },
  {
    id: 'frame-2',
    name: 'Bannière Croix & Étoiles',
    category: 'cadres',
    pattern: '••═╬✦░░░░ Titre ░░░░✦╬═••',
  },
  {
    id: 'frame-3',
    name: 'Guirlande Florale',
    category: 'cadres',
    pattern: '•❈•❉•❊•₪₪₪ Titre ₪₪₪•❃•❅•❆•',
  },
  {
    id: 'frame-4',
    name: 'Nuage Enneigé',
    category: 'cadres',
    pattern: '.•❅☁█▒░ Titre ░▒█☁❅•.',
  },
  {
    id: 'frame-5',
    name: 'Flocons Royaux',
    category: 'cadres',
    pattern: '.•❅•✬❆❆ Titre ❆❆✬•❅•.',
  },
  {
    id: 'frame-6',
    name: 'Cadre Géométrique 3D',
    category: 'cadres',
    pattern: '╔═════ ▓▓ ✵ Titre ✵ ▓▓ ═════╗\n  ...\n╚═════════════════════════╝',
  },
  {
    id: 'frame-7',
    name: 'Palais Impérial',
    category: 'cadres',
    pattern: '╔═════ஜ۩۞۩ஜ═════╗\n       Titre\n╚═════ஜ۩۞۩ஜ═════╝',
  },
  {
    id: 'frame-8',
    name: 'Balise Fléchée',
    category: 'cadres',
    pattern: '┍──━──━──┙◆ Titre ◆┕──━──━──┑\n  ...\n┕──━──━──┑◆ Titre ◆┍──━──━──┙',
  },
  {
    id: 'frame-9',
    name: 'Grille Parallèle',
    category: 'cadres',
    pattern: '╧╤╧╤╧╤╧╤╧╤╧╤╧╤╧╤\n     Titre\n╧╤╧╤╧╤╧╤╧╤╧╤╧╤╧╤',
  },
  {
    id: 'frame-10',
    name: 'Bordure Étoile & Barre',
    category: 'cadres',
    pattern: '╚─━━━━━━░★ Titre ★░━━━━━━─╝',
  },

  // Séparateurs de sections
  {
    id: 'sep-1',
    name: 'Étoile des Neiges',
    category: 'separateurs',
    pattern: '───❅✵ ·❆· ✵❅───',
  },
  {
    id: 'sep-2',
    name: 'Ruban Royal Triangle',
    category: 'separateurs',
    pattern: '══════ஜ▲ஜ══════',
  },
  {
    id: 'sep-3',
    name: 'Trèfle & Nœud',
    category: 'separateurs',
    pattern: '══════◄••❀••►══════',
  },
  {
    id: 'sep-4',
    name: 'Barre Prestige Double',
    category: 'separateurs',
    pattern: '●▬▬▬▬๑۩۩๑▬▬▬▬▬●',
  },
  {
    id: 'sep-5',
    name: 'Barre Carreau & Damier',
    category: 'separateurs',
    pattern: '┯━━━━━▧▣▧━━━━━┯',
  },
  {
    id: 'sep-6',
    name: 'Flèche Losange Celtique',
    category: 'separateurs',
    pattern: '≪━─━─━─━─◈─━─━─━─━≫',
  },
  {
    id: 'sep-7',
    name: 'Croix Quadruple',
    category: 'separateurs',
    pattern: '═════ ✥.❖.✥ ═════',
  },
  {
    id: 'sep-8',
    name: 'Losange Cerclé',
    category: 'separateurs',
    pattern: '× •-•-•-•⟮ ◆ ⟯•-•-•-• ×',
  },
  {
    id: 'sep-9',
    name: 'Boîte Sakura',
    category: 'separateurs',
    pattern: '✿❯────「✿」────❮✿',
  },
  {
    id: 'sep-10',
    name: 'Ronce & Cœur Floral',
    category: 'separateurs',
    pattern: '❦ ════ •⊰❂⊱• ════ ❦',
  },
  {
    id: 'sep-11',
    name: 'Ailes de Dragon',
    category: 'separateurs',
    pattern: '━━━━━━━༺༻━━━━━━━',
  },
  {
    id: 'sep-12',
    name: 'Croix de Fer & Épée',
    category: 'separateurs',
    pattern: '࿇ ══━━━━✥◈✥━━━━══ ࿇',
  },
  {
    id: 'sep-13',
    name: 'Portée Musicale',
    category: 'separateurs',
    pattern: '━━━━━━━ •♬• ━━━━━━━',
  },
  {
    id: 'sep-14',
    name: 'Bouton Sceau Royal',
    category: 'separateurs',
    pattern: '◆━━━━━━━▣✦▣━━━━━━━━◆',
  },

  // Ornements et Cœurs
  {
    id: 'orn-1',
    name: 'Amour Bulle',
    category: 'ornements',
    pattern: '~♡ⓛⓞⓥⓔ♡~',
  },
  {
    id: 'orn-2',
    name: 'Papillon & Cœur',
    category: 'ornements',
    pattern: '˙·٠•●♥ Ƹ̵̡Ӝ̵̨̄Ʒ ♥●•٠·˙',
  },
  {
    id: 'orn-3',
    name: 'Vague de Cœurs',
    category: 'ornements',
    pattern: 'ᶫᵒᵛᵉᵧₒᵤ ᶫᵒᵛᵉᵧₒᵤᶫᵒᵛᵉᵧₒᵤ ᶫᵒᵛᵉᵧₒᵤ',
  },
  {
    id: 'orn-4',
    name: 'Étincelles & Fleur',
    category: 'ornements',
    pattern: 'ﾟ･✻･ﾟ･✻･ﾟﾟ･✻･ﾟ･✻･ﾟﾟ･✻･ﾟ',
  },
  {
    id: 'orn-5',
    name: 'Bonhomme de neige féerique',
    category: 'ornements',
    pattern: '.•°*”˜˜”*°•♥●❅•☃•❅●♥°*”˜˜”*°•',
  },
  {
    id: 'orn-6',
    name: 'Baiser Quadruple Cœur',
    category: 'ornements',
    pattern: '(_¸.•’´(_¸.•’´*♥♥♥♥*`’•.¸_)`’•.¸_)',
  },
  {
    id: 'orn-7',
    name: 'Étoile Céleste Joyeux Noël',
    category: 'ornements',
    pattern: '*°.˛*.˛°*★ Joyeux Agenda ★*°*.˛°*',
  },
  {
    id: 'orn-8',
    name: 'Émoticône Soleil Nuage',
    category: 'ornements',
    pattern: '۞₪✰♡✰☁☼✿⚈‿‿⚈✿☼☁✰♡✰₪۞',
  },
  {
    id: 'orn-9',
    name: 'Nœud Papillon Romantique',
    category: 'ornements',
    pattern: '︵‿︵‿୨♡୧‿︵‿︵',
  },
  {
    id: 'orn-10',
    name: 'Émotion Visage',
    category: 'ornements',
    pattern: '‿︵‿︵(ಥ﹏ಥ)‿︵‿︵',
  },

  // Action / Gamer
  {
    id: 'sym-1',
    name: 'Sniper Barrett',
    category: 'symboles',
    pattern: '︻╦̵̵͇̿̿̿̿══╤─',
  },
  {
    id: 'sym-2',
    name: 'Fusil Compact',
    category: 'symboles',
    pattern: '▄︻̷̿┻̿═━一',
  },
  {
    id: 'sym-3',
    name: 'Fusil Précision SM',
    category: 'symboles',
    pattern: '▄℠︻̷̿┻̿═━一̿’',
  },
];

// Convertisseur de Polices Ultra Stylées (Unicode Typography Converter)
export type StylishFontFamily = 
  | 'normal'
  | 'fraktur'
  | 'script'
  | 'boldSerif'
  | 'doubleStruck'
  | 'sansItalic'
  | 'monospace'
  | 'circled'
  | 'inverted';

export const STYLISH_FONTS: { id: StylishFontFamily; name: string; preview: string }[] = [
  { id: 'fraktur', name: '𝔊𝔬𝔱𝔥𝔦𝔮𝔲𝔢 (Fraktur)', preview: '𝔄𝔤𝔢𝔫𝔡𝔞' },
  { id: 'script', name: '𝒞𝒶𝓁𝓁𝒾𝑔𝓇𝒶𝓅𝒽𝒾𝑒 (Script)', preview: '𝒜𝑔𝑒𝓃𝒹𝒶' },
  { id: 'boldSerif', name: '𝐁𝐨𝐥𝐝 𝐒𝐞𝐫𝐢𝐟 (Royal)', preview: '𝐀𝐠𝐞𝐧𝐝𝐚' },
  { id: 'doubleStruck', name: '𝔸𝕝𝕘𝕖𝕓𝕣𝕚𝕔 (Double-Struck)', preview: '𝔸𝕘𝕖𝕟𝕕𝕒' },
  { id: 'sansItalic', name: '𝘚𝘢𝘯𝘴 𝘐𝘵𝘢𝘭𝘪𝘤 (Moderne)', preview: '𝘈𝘨𝘦𝘯𝘥𝘢' },
  { id: 'monospace', name: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎 (Machine)', preview: '𝙰𝚐𝚎𝚗𝚍𝚊' },
  { id: 'circled', name: 'Ⓒⓘⓡⓒⓛⓔⓓ (Bulles)', preview: 'Ⓐⓖⓔⓝⓓⓐ' },
  { id: 'inverted', name: 'ʎsɹǝʌuI (Renversé)', preview: 'ɐpuǝƃ∀' },
];

function createCharMap(from: string, to: string): Record<string, string> {
  const map: Record<string, string> = {};
  const toChars = Array.from(to);
  const fromChars = Array.from(from);
  for (let i = 0; i < fromChars.length; i++) {
    if (toChars[i]) {
      map[fromChars[i]] = toChars[i];
    }
  }
  return map;
}

function createInvertedMap(): Record<string, string> {
  const normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?.,!_'";
  const upside = "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀ᗺƆᗡƎℲפHIſʞ˥WNOԀQᴚS┴∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86¿˙'¡,-";
  const map: Record<string, string> = {};
  for (let i = 0; i < normal.length; i++) {
    map[normal[i]] = upside[i] || normal[i];
  }
  return map;
}

// Dictionnaires de transformation Unicode
const FONT_MAPS: Record<StylishFontFamily, Record<string, string>> = {
  normal: {},
  fraktur: createCharMap(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷0123456789'
  ),
  script: createCharMap(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    '𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏0123456789'
  ),
  boldSerif: createCharMap(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗'
  ),
  doubleStruck: createCharMap(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'
  ),
  sansItalic: createCharMap(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻0123456789'
  ),
  monospace: createCharMap(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'
  ),
  circled: createCharMap(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨'
  ),
  inverted: createInvertedMap(),
};

export function transformTextToStyle(text: string, style: StylishFontFamily): string {
  if (style === 'normal') return text;
  const map = FONT_MAPS[style];
  if (!map) return text;

  if (style === 'inverted') {
    return Array.from(text)
      .reverse()
      .map((ch) => map[ch] || ch)
      .join('');
  }

  return Array.from(text)
    .map((ch) => map[ch] || ch)
    .join('');
}
