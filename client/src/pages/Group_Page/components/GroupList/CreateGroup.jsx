import React, { useState } from "react";
import Input from "../../../../components/comman/Input";
import Button from "../../../../components/comman/Button";
import "./CreateGroup.css";

function CreateGroup({ onCreate }) {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupName.trim()) return;

    onCreate(groupName.trim());
    setGroupName("");
  };
  return (
    <form className="group-form" onSubmit={handleSubmit}>
      <h3>Create Group</h3>
      <Input
        label="Group Name"
        id="form-create"
        className="group-label"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <Button className="create-btn" text="Create" type="submit" />
    </form>
  );
}

export default CreateGroup;
