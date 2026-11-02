import { airbnbUrl, type Stay } from '@/data/stays';

const fieldClass =
  'mt-1 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink';

// A plain GET form, so dates reach Airbnb without any client-side JavaScript.
export function BookingForm({ stay }: { stay: Stay }) {
  return (
    <form action={airbnbUrl(stay)} method="get" target="_blank" className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs font-medium">
          Check-in
          <input type="date" name="check_in" className={fieldClass} />
        </label>
        <label className="block text-xs font-medium">
          Checkout
          <input type="date" name="check_out" className={fieldClass} />
        </label>
      </div>
      <label className="block text-xs font-medium">
        Guests
        <select name="adults" defaultValue="6" className={fieldClass}>
          {Array.from({ length: stay.guests }, (_, index) => index + 1).map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? 'guest' : 'guests'}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="w-full rounded-md bg-ember px-4 py-3 font-medium text-white transition-colors hover:bg-ember-dark"
      >
        Check dates on Airbnb
      </button>
      <p className="text-center text-xs text-stone">Live pricing and availability open on Airbnb.</p>
    </form>
  );
}
