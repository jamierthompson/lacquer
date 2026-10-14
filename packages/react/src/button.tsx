/**
 * Button — the react implementation.
 * Spec: @lacquer/core, spec/catalog/core/actions/button/button.yaml
 *
 * The native button, always (LQ-BUTTON-01), with the label as visible text
 * in the label part and the icons as decorative slots around it. Loading
 * puts the spinner in the leading icon's box so the width holds and gates
 * the press (LQ-BUTTON-02). Every state is an attribute; the stylesheet is
 * the HTML reference's.
 */
import "@lacquer/core/catalog/core/actions/button/examples/html/button.css";
import type { ComponentProps, ReactNode } from "react";

export interface ButtonProps extends Omit<
  ComponentProps<"button">,
  "children"
> {
  emphasis?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
  size?: "xs" | "sm" | "md" | "lg";
  /** Shows the spinner, blocks activation, keeps width. */
  loading?: boolean;
  /** Keeps the button focusable so a tooltip can explain why it is unavailable. */
  softDisabled?: boolean;
  fullWidth?: boolean;
  /** Decorative; the label stays the accessible name. */
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** The data-slot name this element fills in a parent's anatomy. */
  part?: string;
  /** The label: visible text, and the accessible name. */
  children: ReactNode;
}

export function Button({
  emphasis = "secondary",
  size = "md",
  loading = false,
  softDisabled = false,
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  part,
  type = "button",
  onClick,
  children,
  ...rest
}: ButtonProps) {
  // Soft-disabled and loading stay focusable but do not press.
  const inert = loading || softDisabled;
  return (
    <button
      type={type}
      data-lacquer="button"
      data-slot={part}
      data-emphasis={emphasis}
      data-size={size}
      data-full-width={fullWidth || undefined}
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
        leadingIcon != null && (
          <span data-slot="leading-icon" aria-hidden="true">
            {leadingIcon}
          </span>
        )
      )}
      <span data-slot="label">{children}</span>
      {trailingIcon != null && (
        <span data-slot="trailing-icon" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  );
}
