/**
 * Textarea — the react implementation.
 * Spec: @lacquer/core, spec/catalog/core/inputs/textarea/textarea.yaml
 *
 * The same markup as the HTML reference, with the reference's stylesheet:
 * a root that draws the frame and carries the variant attributes, a bare
 * native control inside it, and an optional counter. Autosize is the
 * stylesheet's `field-sizing: content`; this module adds no measuring.
 */
import "@lacquer/core/catalog/core/inputs/textarea/examples/html/textarea.css";
import {
  useId,
  useState,
  type ComponentProps,
  type CSSProperties,
} from "react";

export interface TextareaProps extends Omit<
  ComponentProps<"textarea">,
  "value" | "defaultValue" | "onChange" | "rows" | "className" | "style"
> {
  /** The text, when controlled. */
  value?: string;
  /** The initial text, when uncontrolled. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  sizing?: "fixed" | "autosize";
  frame?: "outlined" | "borderless";
  size?: "sm" | "md" | "lg";
  /** Lines shown while empty; the minimum height when autosizing. */
  rows?: number;
  /** Lines the control grows to before it scrolls (autosize only). */
  maxRows?: number;
  invalid?: boolean;
  /** The data-slot name this element fills in a parent's anatomy. */
  part?: string;
  className?: string;
  style?: CSSProperties;
}

export function Textarea({
  value,
  defaultValue = "",
  onChange,
  sizing = "autosize",
  frame = "outlined",
  size = "md",
  rows = 1,
  maxRows = 8,
  invalid = false,
  part,
  className,
  style,
  maxLength,
  "aria-describedby": describedBy,
  ...rest
}: TextareaProps) {
  const [draft, setDraft] = useState(defaultValue);
  const text = value ?? draft;
  const generated = useId();
  const counterId = maxLength === undefined ? undefined : `${generated}counter`;

  return (
    <div
      data-lacquer="textarea"
      data-slot={part}
      data-sizing={sizing}
      data-frame={frame}
      data-size={size}
      data-empty={text === "" || undefined}
      className={className}
      style={{ ...style, "--lq-textarea-max-rows": maxRows } as CSSProperties}
    >
      <textarea
        data-slot="control"
        rows={rows}
        value={text}
        maxLength={maxLength}
        aria-invalid={invalid || undefined}
        aria-describedby={
          [describedBy, counterId].filter(Boolean).join(" ") || undefined
        }
        onChange={(e) => {
          if (value === undefined) setDraft(e.currentTarget.value);
          onChange?.(e.currentTarget.value);
        }}
        {...rest}
      />
      {counterId && (
        <span data-slot="counter" id={counterId}>
          {text.length} / {maxLength}
        </span>
      )}
    </div>
  );
}
