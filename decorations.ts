// Décors, cadres et polices ultra stylées Unicode pour l'application native Android

export interface TextDecoration {
  id: string;
  name: string;
  category: 'frame' | 'separator' | 'ornament';
  template: string; // Contains "Placeholder" or "Titre"
}

export const DECORATIONS: TextDecoration[] = [
  {
    id: 'frame-1',
    name: 'Cadre Étoilé',
    category: 'frame',
    template: '╔═════¦✵ Placeholder ✵¦═════╗\n║\n╚════════════════════╝',
  },
  {
    id: 'frame-2',
    name: 'Bannière Flocons',
    category: 'frame',
    template: '•❈•❉•❊•₪₪₪ Placeholder ₪₪₪•❃•❅•❆•',
  },
  {
    id: 'frame-3',
    name: 'Nuage & Givre',
    category: 'frame',
    template: '.•❅☁█▒░❆‿❆░▒█☁❅•.\n   Placeholder\n.•❅☁█▒░❆‿❆░▒█☁❅•.',
  },
  {
    id: 'sep-1',
    name: 'Ligne Croix & Flocons',
    category: 'separator',
    template: '••═╬✦░░░░ Placeholder ░░░░✦╬═••',
  },
  {
    id: 'sep-2',
    name: 'Ligne Étoiles & Flocon',
    category: 'separator',
    template: '───❅✵ ·❆· ✵❅───',
  },
  {
    id: 'orn-1',
    name: 'Cœur Love Bulles',
    category: 'ornament',
    template: '~♡ⓛⓞⓥⓔ♡~',
  },
  {
    id: 'orn-2',
    name: 'Papillon & Cœur',
    category: 'ornament',
    template: '˙·٠•●♥ Ƹ̵̡Ӝ̵̨̄Ʒ ♥●•٠·˙',
  },
  {
    id: 'orn-3',
    name: 'Love You Infini',
    category: 'ornament',
    template: 'ᶫᵒᵛᵉᵧₒᵤ ᶫᵒᵛᵉᵧₒᵤᶫᵒᵛᵉᵧₒᵤ ᶫᵒᵛᵉᵧₒᵤ',
  },
  {
    id: 'orn-4',
    name: 'Flèches Doubles',
    category: 'ornament',
    template: '≪ °❈° ≫ Placeholder ≪ °❈° ≫',
  },
  {
    id: 'orn-5',
    name: 'Ruban Ailé',
    category: 'ornament',
    template: '꧁༺ Placeholder ༻꧂',
  },
];

export type FontStyleType = 'serif-bold' | 'cursive' | 'gothic' | 'double-struck' | 'bubble' | 'monospace';

const FONT_MAPS: Record<FontStyleType, { normal: string; styled: string }> = {
  'serif-bold': {
    normal: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    styled: '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗',
  },
  cursive: {
    normal: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    styled: '𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵',
  },
  gothic: {
    normal: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    styled: '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ',
  },
  'double-struck': {
    normal: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    styled: '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡',
  },
  bubble: {
    normal: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    styled: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨',
  },
  monospace: {
    normal: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    styled: '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿',
  },
};

export function transformToStylishFont(text: string, style: FontStyleType): string {
  const map = FONT_MAPS[style];
  if (!map) return text;

  const normalChars = Array.from(map.normal);
  const styledChars = Array.from(map.styled);

  const charMap: Record<string, string> = {};
  for (let i = 0; i < normalChars.length; i++) {
    charMap[normalChars[i]] = styledChars[i] || normalChars[i];
  }

  return Array.from(text)
    .map((ch) => charMap[ch] || ch)
    .join('');
}
