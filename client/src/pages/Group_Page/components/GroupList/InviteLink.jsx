import Button from "../../../../components/comman/Button";


function InviteSuccess({ inviteLink}) {
  return (
    <div className="invite-success">
      <h3>Group Created 🎉</h3>
      <p>Share this link:</p>

      <div
        className="invite-box"
        onClick={() => navigator.clipboard.writeText(inviteLink)}
      >
        {inviteLink}
      </div>

      <p className="copy-hint">Click to copy</p>

      
    </div>
  );
}

export default InviteSuccess;
