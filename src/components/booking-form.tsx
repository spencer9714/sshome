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

export function BookingForm({ stay }: { stay: Stay }) {
  const [today, setToday] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('6');

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
          Check-in
          <input type="date" name="check_in" required min={today || undefined} value={checkIn}
            onChange={(event) => {
              const value = event.target.value;
              setCheckIn(value);
              if (value && checkOut && checkOut <= value) setCheckOut('');
            }} className={fieldClass} />
        </label>
        <label className="block text-xs font-medium">
          Checkout
          <input type="date" name="check_out" required min={checkIn ? nextDay(checkIn) : today || undefined}
            value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className={fieldClass} />
        </label>
      </div>
      <label className="block text-xs font-medium">
        Guests
        <select name="adults" value={guests} onChange={(event) => setGuests(event.target.value)} className={fieldClass}>
          {Array.from({ length: stay.guests }, (_, index) => index + 1).map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? 'guest' : 'guests'}
            </option>
          ))}
        </select>
      </label>
      <input type="hidden" name="guests" value={guests} />
      <p aria-live="polite" className="text-sm text-stone">
        {nights > 0 ? `${nights} ${nights === 1 ? 'night' : 'nights'} / ${guests} ${guests === '1' ? 'guest' : 'guests'}` : 'Choose your check-in and checkout dates.'}
      </p>
      <button
        type="submit"
        className="w-full rounded-md bg-ember px-4 py-3 font-medium text-white transition-colors hover:bg-ember-dark"
      >
        {nights > 0 ? `View ${nights} ${nights === 1 ? 'night' : 'nights'} on Airbnb` : 'Continue to Airbnb'}
      </button>
      <p className="text-center text-xs text-stone">Your dates and guest count carry over to Airbnb. Confirm availability and the final price there.</p>
    </form>
  );
}
