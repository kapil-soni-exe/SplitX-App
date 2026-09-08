import React, { useState } from "react";
import Input from "../../../../components/comman/Input";
import Button from "../../../../components/comman/Button";
import { RiGroupLine } from "@remixicon/react";
import "./CreateGroup.css";

function CreateGroup({ onCreate }) {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupName.trim()) return;

    onCreate(groupName.trim());
    setGroupName("");
  };

  const isFormDisabled = !groupName.trim();

  return (
    <form className="group-form" onSubmit={handleSubmit}>
      {/* HEADER WITH ICON & VISUAL CONTEXT */}
      <div className="create-group-header">
        <div className="create-group-icon-circle">
          <RiGroupLine size={30} />
        </div>
        <h3 className="create-group-title">Create a new group</h3>
        <p className="create-group-subtitle">
          Give your group a name to get started
        </p>
      </div>

      {/* INPUT FIELD */}
      <Input
        label="Group Name"
        id="form-create"
        placeholder="e.g. Goa Trip, Flatmates, Weekend Squad"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      {/* HELPER TEXT */}
      <p className="create-group-helper">
        You can invite friends after creating the group
      </p>

      {/* SUBMIT BUTTON */}
      <Button
        className="create-group-submit-btn"
        text="Create Group"
        type="submit"
        variant="primary"
        disabled={isFormDisabled}
      />
    </form>
  );
}

export default CreateGroup;
