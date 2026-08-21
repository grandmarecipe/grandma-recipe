interface AdSlotProps {
  slot: "recipe-sidebar" | "recipe-in-content";
  className?: string;
}

const SLOT_LABELS: Record<AdSlotProps["slot"], string> = {
  "recipe-sidebar": "AdSense — sidebar",
  "recipe-in-content": "AdSense — below article",
};

/**
 * AdSense placeholder — swap the inner content for your ad unit once
 * the AdSense script and publisher ID are configured in layout.
 */
export function AdSlot({ slot, className = "" }: AdSlotProps) {
  return (
    <div className={`ad-slot no-print ${className}`} data-ad-slot={slot}>
      <span className="text-sm text-muted">{SLOT_LABELS[slot]}</span>
    </div>
  );
}
