/**
 * Icon Button — the react implementation.
 * Spec: @lacquer/core, spec/catalog/core/actions/icon-button/icon-button.yaml
 *
 * A native button whose name is a required prop (LQ-NAME-01) and whose
 * only visible content is the icon, wrapped in the icon part and hidden
 * from assistive tech. Every state is an attribute on the element; the
 * stylesheet is the HTML reference's.
 */
import "@lacquer/core/catalog/core/actions/icon-button/examples/html/icon-button.css";
import type { ComponentProps, ReactNode } from "react";

export interface IconButtonProps extends Omit<
  ComponentProps<"button">,
  "aria-label" | "children"
> {
  /** The accessible name. Required; there is no icon-button without one. */
  label: string;
  emphasis?: "ghost" | "outline" | "tonal" | "filled" | "destructive";
  shape?: "square" | "round";
  size?: "xs" | "sm" | "md" | "lg";
  /** Toggle usage; omitted means not a toggle. */
  pressed?: boolean;
  loading?: boolean;
  /** Keeps the button focusable so a tooltip can explain why it is unavailable. */
  softDisabled?: boolean;
  badge?: ReactNode;
  /** The data-slot name this element fills in a parent's anatomy. */
  part?: string;
  /** The icon. Decorative; the name is `label`. */
  children: ReactNode;
}

export function IconButton({
  label,
  emphasis = "ghost",
  shape = "square",
  size = "md",
  pressed,
  loading = false,
  softDisabled = false,
  badge,
  part,
  type = "button",
  onClick,
  children,
  ...rest
}: IconButtonProps) {
  // Soft-disabled and loading stay focusable but do not press.
  const inert = loading || softDisabled;
  return (
    <button
      type={type}
      data-lacquer="icon-button"
      data-slot={part}
      data-emphasis={emphasis}
      data-shape={shape}
      data-size={size}
      aria-label={label}
      aria-pressed={pressed}
      aria-busy={loading || undefined}
      aria-disabled={inert || undefined}
      onClick={(e) => {
        if (inert) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      {...rest}
    >
      {loading ? (
        <span data-slot="spinner" aria-hidden="true" />
      ) : (
        <span data-slot="icon" aria-hidden="true">
          {children}
        </span>
      )}
      {badge != null && <span data-slot="badge">{badge}</span>}
    </button>
  );
}
