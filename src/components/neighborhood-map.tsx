import { mapPoint, mapZoom, neighborhoodCheckedOn, neighborhoods, publicPlaceMapUrl } from '@/data/neighborhoods';

export function NeighborhoodMap({ slug, language = 'en' }: { slug: string; language?: 'en' | 'zh-Hant' }) {
  const zh = language === 'zh-Hant';
  const key = slug.startsWith('desert-') ? 'desert' : 'family';
  const { area, bounds, places } = neighborhoods[key];
  const topLeft = mapPoint(bounds.north, bounds.west);
  const bottomRight = mapPoint(bounds.south, bounds.east);
  const width = bottomRight.x - topLeft.x;
  const height = bottomRight.y - topLeft.y;
  const center = mapPoint(area.latitude, area.longitude);
  const radius = 900 / (156543.03392 * Math.cos(area.latitude * Math.PI / 180) / 2 ** mapZoom);
  const tiles = [];
  for (let x = Math.floor(topLeft.x / 256); x <= Math.floor(bottomRight.x / 256); x++) {
    for (let y = Math.floor(topLeft.y / 256); y <= Math.floor(bottomRight.y / 256); y++) {
      tiles.push(<image key={`${x}-${y}`} href={`/maps/visalia/${mapZoom}-${x}-${y}.png`} x={x * 256 - topLeft.x} y={y * 256 - topLeft.y} width="256" height="256" />);
    }
  }
  const categories = zh
    ? { shopping: '採買', 'shopping-gas': '採買・加油', charging: '公共 EV 充電', supercharging: 'Tesla 超級充電站' }
    : { shopping: 'Shopping', 'shopping-gas': 'Shopping + gas', charging: 'Public EV charging', supercharging: 'Tesla Supercharger' };
  function travelLabel(travel: { miles: number; minutes: number }) {
    const low = Math.max(0.5, Math.floor((travel.miles - 0.75) * 2) / 2);
    const high = Math.ceil((travel.miles + 0.75) * 2) / 2;
    const km = `${Math.round(low * 1.609)}–${Math.round(high * 1.609)}`;
    const minutes = `${Math.max(3, Math.floor((travel.minutes - 2) / 5) * 5)}–${Math.ceil((travel.minutes + 4) / 5) * 5}`;
    return zh ? `區域參考車程：約 ${minutes} 分鐘・${km} 公里（${low}–${high} 英里）` : `Area estimate: ${minutes} min drive · ${low}–${high} mi (${km} km)`;
  }
  return <section aria-labelledby={`${key}-neighborhood-title`} className="mt-8 rounded-lg border border-line bg-white p-4 sm:p-6">
    <h3 id={`${key}-neighborhood-title`} className="text-2xl">{zh ? '看看附近有什麼' : 'A few useful stops nearby'}</h3>
    <p className="mt-3 text-sm leading-relaxed text-stone">{zh ? '採買、加油，再出發。陰影只表示住宿的大概區域；確切地址會在訂房後透過 Airbnb 提供。' : 'Pick up groceries, fuel up, and get on with your day. The shaded circle shows the general area only; Airbnb provides the exact address after booking.'}</p>
    <figure className="mt-5">
      <div className="relative overflow-hidden rounded-md border border-line bg-sand">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${key}-map-title ${key}-map-description`} className="block h-[300px] w-full sm:h-[340px]">
          <title id={`${key}-map-title`}>{zh ? 'Visalia 周邊採買與補給地圖' : 'Shopping, gas, and EV charging in Visalia'}</title>
          <desc id={`${key}-map-description`}>{zh ? '住宿以大範圍圓圈表示，沒有精確圖釘。編號對應下方公開商家。' : 'A broad circle indicates the neighborhood, without a home pin. Numbered markers correspond to the public businesses listed below.'}</desc>
          {tiles}
          <circle cx={center.x - topLeft.x} cy={center.y - topLeft.y} r={radius} fill="#b85e37" fillOpacity="0.22" stroke="#9b4528" strokeWidth="2" strokeDasharray="5 4" />
          {places.map((place, index) => {
            const point = mapPoint(place.latitude, place.longitude);
            return <a key={place.name} href={publicPlaceMapUrl(place)} target="_blank" rel="noopener noreferrer" aria-label={`${place.name} — ${zh ? '在地圖開啟（新分頁）' : 'open in maps (new tab)'}`}>
              <circle cx={point.x - topLeft.x} cy={point.y - topLeft.y} r="14" fill={place.category === 'supercharging' ? '#b33d32' : place.category === 'charging' ? '#285f52' : '#252c42'} stroke="white" strokeWidth="2" />
              <text x={point.x - topLeft.x} y={point.y - topLeft.y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">{index + 1}</text>
            </a>;
          })}
        </svg>
        <span className="pointer-events-none absolute left-2 top-2 rounded bg-white/95 px-2 py-1 text-xs font-medium">{zh ? '陰影＝住宿大概區域' : 'Shaded circle = general area'}</span>
        <span aria-hidden="true" className="pointer-events-none absolute right-2 top-2 rounded bg-white/95 px-2 py-1 text-xs">N ↑</span>
      </div>
      <figcaption className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-stone"><span>{zh ? '概略位置，非住宅邊界' : 'Approximate area, not a property boundary'}</span><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">© OpenStreetMap contributors</a></figcaption>
    </figure>
    <p className="mt-4 rounded-md bg-sand px-3 py-2 text-xs leading-relaxed text-stone">{zh ? '以下為從地圖概略區域估算的道路距離與車程範圍，不是從住宅門口測量，也不含即時路況；實際車程依出發位置與交通而異。' : 'Distances and drive times are broad road-route estimates from the approximate area shown, not the front door. They exclude live traffic and vary with your starting point and route.'}</p>
    <ol className="mt-5 divide-y divide-line">
      {places.map((place, index) => <li key={place.name} className="flex items-start gap-3 py-4 first:pt-0">
        <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-dusk text-sm font-medium text-white">{index + 1}</span>
        <div className="min-w-0 flex-1"><p className="text-xs font-medium text-ember">{categories[place.category]}</p><p className="mt-1 font-medium">{place.name}</p>{place.travel && <p className="mt-2 text-sm font-medium">{travelLabel(place.travel)}</p>}<p className="mt-1 text-xs leading-relaxed text-stone">{place.address}</p><div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm"><a href={publicPlaceMapUrl(place)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{zh ? '在地圖開啟 ↗' : 'Open in maps ↗'}</a><a href={place.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{zh ? '官方地點資訊 ↗' : 'Location details ↗'}</a></div></div>
      </li>)}
    </ol>
    <p className="mt-3 text-xs leading-relaxed text-stone">{zh ? '商家資訊查核：' : 'Locations checked: '}{neighborhoodCheckedOn}{zh ? '。出發前請確認營業時間、Costco 會員規定與充電站車輛相容性、費用及即時狀態。Tesla Supercharger 是公共快速充電站，與住宿內另計費的 Level 2 充電器不同。請在 Tesla App 確認車輛資格、轉接頭、費用與即時狀態。' : '. Check opening hours, Costco membership requirements, and charger compatibility, pricing, and availability before heading out. Tesla Superchargers are public fast chargers, separate from the Level 2 charger at the house. Charging at the house costs extra. Check the Tesla app for vehicle eligibility, adapters, pricing, and live availability.'}</p>
  </section>;
}
