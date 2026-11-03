'use client';

import { useEffect, useState } from 'react';
import { airbnbUrl, type Stay } from '@/data/stays';

const fieldClass =
  'mt-1 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink';

function nextDay(date: string) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}

export function BookingForm({ stay, language = 'en' }: { stay: Stay; language?: 'en' | 'zh-Hant' }) {
  const zh = language === 'zh-Hant';
  const [today, setToday] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(6);
  const [children, setChildren] = useState(0);
  const guests = adults + children;

  useEffect(() => {
    const now = new Date();
    setToday(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
  }, []);

  const nights = checkIn && checkOut
    ? Math.round((Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86400000)
    : 0;

  return (
    <form action={airbnbUrl(stay)} method="get" data-booking-placement="date-form" className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs font-medium">
          {zh ? '入住日期' : 'Check-in'}
          <input type="date" name="check_in" required min={today || undefined} value={checkIn}
            onChange={(event) => {
              const value = event.target.value;
              setCheckIn(value);
              if (value && checkOut && checkOut <= value) setCheckOut('');
            }} className={fieldClass} />
        </label>
        <label className="block text-xs font-medium">
          {zh ? '退房日期' : 'Checkout'}
          <input type="date" name="check_out" required min={checkIn ? nextDay(checkIn) : today || undefined}
            value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className={fieldClass} />
        </label>
      </div>
      <label className="block text-xs font-medium">
        {zh ? '成人（13歲以上）' : 'Adults (13+)'}
        <select name="adults" value={adults} onChange={(event) => {
          const value = Number(event.target.value);
          setAdults(value);
          setChildren((count) => Math.min(count, stay.guests - value));
        }} className={fieldClass}>
          {Array.from({ length: stay.guests }, (_, index) => index + 1).map((count) => (
            <option key={count} value={count}>
              {zh ? `${count} 位成人` : `${count} ${count === 1 ? 'adult' : 'adults'}`}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs font-medium">
        {zh ? '兒童（2～12歲）' : 'Children (2–12)'}
        <select name="children" value={children} onChange={(event) => setChildren(Number(event.target.value))} className={fieldClass}>
          {Array.from({ length: stay.guests - adults + 1 }, (_, count) => <option key={count} value={count}>{zh ? `${count} 位兒童` : `${count} ${count === 1 ? 'child' : 'children'}`}</option>)}
        </select>
      </label>
      <p className="text-xs text-stone">{zh ? '攜帶未滿2歲嬰兒？請在 Airbnb 加入嬰兒人數，並向房東確認合適的安排。' : 'Traveling with infants under 2? Add them on Airbnb and confirm suitable arrangements with the host.'}</p>
      <input type="hidden" name="guests" value={guests} />
      <p aria-live="polite" className="text-sm text-stone">
        {zh ? (nights > 0 ? `${nights} 晚 / ${guests} 位旅客` : '請選擇入住與退房日期。') : (nights > 0 ? `${nights} ${nights === 1 ? 'night' : 'nights'} / ${guests} ${guests === 1 ? 'guest' : 'guests'}` : 'Choose your check-in and checkout dates.')}
      </p>
      <button
        type="submit"
        className="w-full rounded-md bg-ember px-4 py-3 font-medium text-white transition-colors hover:bg-ember-dark"
      >
        {zh ? (nights > 0 ? `到 Airbnb 查看 ${nights} 晚價格` : '前往 Airbnb') : (nights > 0 ? `View ${nights} ${nights === 1 ? 'night' : 'nights'} on Airbnb` : 'Continue to Airbnb')}
      </button>
      <p className="text-center text-xs text-stone">{zh ? '日期與人數會帶入 Airbnb，實際空房及最終價格請在 Airbnb 確認。' : 'Your dates and guest count will be sent to Airbnb. Check availability and your total price there.'}</p>
    </form>
  );
}
