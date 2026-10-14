import { initial, step, type Thread } from "./useThread.ts";

/**
 * The event log as a row of steps you can scrub. The status at each step
 * is the log replayed up to it; an event the table ignored is shown dashed.
 */
export function Timeline({ thread }: { thread: Thread }) {
  const { events, shown, scrub } = thread;
  return (
    <ol className="timeline" aria-label="Timeline">
      <li>
        <button
          type="button"
          aria-current={shown.length === 0 ? "step" : undefined}
          onClick={() => scrub(events.length ? 0 : null)}
        >
          <code>{initial}</code>
        </button>
      </li>
      {events.map((e, i) => {
        const { after, ignored } = step(events, i);
        const at = i + 1;
        return (
          <li key={at} data-ignored={ignored || undefined}>
            <button
              type="button"
              aria-current={shown.length === at ? "step" : undefined}
              onClick={() => scrub(at === events.length ? null : at)}
            >
              <span className="event">{e}</span>
              <code>{ignored ? "ignored" : after}</code>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
