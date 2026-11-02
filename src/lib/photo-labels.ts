const spacesZh: Record<string, string> = {
  Pool: '泳池', 'Hot tub': '熱水池', 'Living room': '客廳', Kitchen: '廚房',
  'Dining area': '用餐區', 'Backyard & patio': '後院與露台',
  'Game room': '遊戲室', Loft: '閣樓', Workspace: '工作區',
  'EV charging': 'EV 充電', Entrance: '入口',
};

export function photoSpaceLabel(space: string, language: 'en' | 'zh-Hant') {
  if (language === 'en') return space;
  if (spacesZh[space]) return spacesZh[space];
  const bedroom = space.match(/^Bedroom (\d+)$/);
  if (bedroom) return `臥室 ${bedroom[1]}`;
  const bathroom = space.match(/^Bathroom (\d+)$/);
  if (bathroom) return `衛浴 ${bathroom[1]}`;
  return space;
}
