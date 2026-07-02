import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onSave: (v: string) => void | Promise<void>;
  canEdit: boolean;
  multiline?: boolean;
  maxLength?: number;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
  emptyLabel?: string;
};

export function EditableText({
  value,
  onSave,
  canEdit,
  multiline = false,
  maxLength = 500,
  placeholder = "",
  className,
  inputClassName,
  as: Tag = "span",
  emptyLabel = "—",
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value.trim()) onSave(trimmed);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (!canEdit) {
    return (
      <Tag className={className}>
        {value || <span className="text-muted-foreground/60">{emptyLabel}</span>}
      </Tag>
    );
  }

  if (!editing) {
    const isHeading = Tag === "h1" || Tag === "h2" || Tag === "h3";
    const content = value || placeholder || emptyLabel;
    const label = `Edit ${value || placeholder || "value"}`;
    if (isHeading) {
      return (
        <Tag className={className}>
          <span
            role="button"
            tabIndex={0}
            onClick={() => setEditing(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setEditing(true);
              }
            }}
            aria-label={label}
            className={cn(
              "cursor-text rounded-sm px-0.5 -mx-0.5 hover:bg-primary/5 focus:outline-none focus:ring-1 focus:ring-ring/40 transition-colors",
              !value && "text-muted-foreground/60 italic",
            )}
          >
            {content}
          </span>
        </Tag>
      );
    }
    return (
      <Tag
        role="button"
        tabIndex={0}
        onClick={() => setEditing(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setEditing(true);
          }
        }}
        aria-label={label}
        className={cn(
          "cursor-text rounded-sm px-0.5 -mx-0.5 hover:bg-primary/5 focus:outline-none focus:ring-1 focus:ring-ring/40 transition-colors",
          !value && "text-muted-foreground/60 italic",
          className,
        )}
      >
        {content}
      </Tag>
    );
  }

  const commonProps = {
    value: draft,
    maxLength,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft(e.target.value),
    onBlur: commit,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      } else if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        commit();
      }
    },
    className: cn(
      "w-full rounded-sm border border-ring/40 bg-white px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-ring/40",
      inputClassName,
    ),
  };

  return multiline ? (
    <textarea
      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
      rows={3}
      {...commonProps}
    />
  ) : (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type="text"
      {...commonProps}
    />
  );
}
