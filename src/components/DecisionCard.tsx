import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelativeTime } from "@/components/RelativeTime";
import { SmithCheckpoint } from "@/types";

export function DecisionCard({
  checkpoint,
  quote,
  onApprove,
  onReject,
}: {
  checkpoint: SmithCheckpoint;
  quote?: string;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="mb-3 flex items-start justify-between gap-6 rounded-[14px] border border-border bg-card p-6">
      <div className="max-w-2xl">
        <Link
          href={`/chat/chat_${checkpoint.id}`}
          className="text-[14.5px] font-medium tracking-[-0.1px] text-foreground hover:underline"
        >
          {checkpoint.commentText}
        </Link>
        {quote && (
          <blockquote className="cite text-[14.5px]">&ldquo;{quote}&rdquo;</blockquote>
        )}
        <p className="text-[12.5px] text-faint">
          Argued in Smith session · <RelativeTime iso={checkpoint.createdAt} />
        </p>
      </div>
      <div className="flex shrink-0 gap-2 pt-0.5">
        <Button
          variant="outline"
          className="h-auto rounded-[9px] px-4 py-2 text-[13px]"
          onClick={onReject}
        >
          Reject
        </Button>
        <Button
          variant="default"
          className="h-auto rounded-[9px] px-4 py-2 text-[13px]"
          onClick={onApprove}
        >
          Approve
        </Button>
      </div>
    </div>
  );
}
