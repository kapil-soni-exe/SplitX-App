import Button from "../../../../components/comman/Button";
import { RiShareLine } from "@remixicon/react";

function InviteSuccess({
  inviteLink,
  title = "Invite members",
  subtitle = "Share invite link with others",
}) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join my SplitX group",
          text: "Join our group to split expenses easily",
          url: inviteLink,
        });
      } else {
        await navigator.clipboard.writeText(inviteLink);
        alert("Invite link copied");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  return (
    <div className="invite-success">
      <h3>{title}</h3>
      <p>{subtitle}</p>

      <Button onClick={handleShare}>
        <RiShareLine size={18} />
        Share invite link
      </Button>
    </div>
  );
}

export default InviteSuccess;