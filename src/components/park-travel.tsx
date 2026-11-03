export function ParkTravel({ language = 'en' }: { language?: 'en' | 'zh-Hant' }) {
  const zh = language === 'zh-Hant';
  return <div className="mt-4">
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg border border-line bg-white p-5">
        <p className="text-sm font-medium text-ember">Sequoia National Park</p>
        <h4 className="mt-2 text-xl">Ash Mountain Entrance</h4>
        <p className="mt-2 font-medium">{zh ? 'Visalia 市區參考：約45分鐘・58公里' : 'From Visalia: about 45 min · 36 mi'}</p>
        <p className="mt-2 text-sm leading-relaxed text-stone">{zh ? '沿 Highway 198。這是 NPS 公布的城市至入口參考，不是各房源的門到門車程。' : 'Via Highway 198. This is the NPS city-to-entrance reference, not a door-to-door estimate for either home.'}</p>
        <a href="https://www.nps.gov/seki/planyourvisit/driving-directions.htm" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm underline">{zh ? 'NPS 路線與距離 ↗' : 'NPS directions & distance ↗'}</a>
      </div>
      <div className="rounded-lg border border-line bg-white p-5">
        <p className="text-sm font-medium text-ember">Kings Canyon National Park</p>
        <h4 className="mt-2 text-xl">Big Stump Entrance</h4>
        <p className="mt-2 font-medium">{zh ? 'Visalia 機場參考：約1.5小時' : 'From Visalia airport: about 1.5 hours'}</p>
        <p className="mt-2 text-sm leading-relaxed text-stone">{zh ? '由 Highway 180 進入。NPS 的參考起點為 Visalia Municipal Airport，不是住宿。' : 'Enter via Highway 180. The NPS reference starts at Visalia Municipal Airport, rather than at the house.'}</p>
        <a href="https://home.nps.gov/seki/planyourvisit/directions.htm" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm underline">{zh ? 'NPS 交通資訊 ↗' : 'NPS transportation guide ↗'}</a>
      </div>
    </div>
    <p className="mt-4 text-sm leading-relaxed text-stone">{zh ? '到入口不等於到巨杉景點。General Sherman、Giant Forest 與 Grant Grove 仍需額外山路、停車及步行時間；請依 NPS 最新道路狀況規劃，並預留排隊與天氣影響。' : 'The entrance is only the start. General Sherman, Giant Forest, and Grant Grove require more driving, parking, and walking. Allow time for entrance lines, weather, and current road conditions.'}</p>
  </div>;
}
