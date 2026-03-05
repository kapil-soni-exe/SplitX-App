import React, { useState } from "react";
import "./GroupList.css";
import {
  getLastActivity,
  getLastActivityTime,
} from "../../utils/groupLastExpense";
import GroupSearch from "./GroupSearch";
import { filterGroupsBySearch } from "../../utils/GroupbySearch";
import Button from "../../../../components/comman/Button";
import Modal from "../../../../components/comman/Model";
import CreateGroup from "../GroupList/CreateGroup";
import { useCreateGroup } from "../../../../hooks/useCreateGroup";
import InviteLink from "../GroupList/InviteLink";

function GroupList({
  groups,
  selectedGroupId,
  onSelectGroup,
  onGroupCreated,
  currentUser,
}) {
  const { create } = useCreateGroup();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const visibleSearch = filterGroupsBySearch(groups, search);
  const [createdGroup, setCreatedGroup] = useState(null);
  const [inviteLink, setInviteLink] = useState(null);

  const handleCreateGroup = async (name) => {
    try {
      const { group, inviteLink } = await create(name);

      setCreatedGroup(group);
      setInviteLink(inviteLink);

      onGroupCreated(group._id);
      onSelectGroup(group._id);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="group-list-panel">
      {/* HEADER */}
      <div className="group-list-header">
        <h3>Groups</h3>
        <div className="header-search">
          <GroupSearch
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="group-list-body">
        <Button
          text="+"
          className="create-group-btn"
          onClick={() => setOpen(true)}
        />
        <Modal
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setCreatedGroup(null);
            setInviteLink(null);
          }}
        >
          {!createdGroup ? (
            <CreateGroup onCreate={handleCreateGroup} />
          ) : (
            <InviteLink inviteLink={inviteLink} />
          )}
        </Modal>

        {visibleSearch.map((group) => {
          const isActive = group._id === selectedGroupId;

          return (
            <div
              key={group._id}
              className={`group-list-item ${isActive ? "active" : ""}`}
              onClick={() => onSelectGroup(group._id)}
            >
              <div className="group-avatar">{group.name[0]}</div>

              <div className="group-info">
                <p className="group-name">{group.name}</p>

                <span className="group-meta">
                  <span className="group-preview-text">
                    {group.lastExpense
                      ? getLastActivity(group, currentUser?.id)
                      : "No activity yet"}
                  </span>
                  <span className="group-last-time">
                    {getLastActivityTime(group)}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GroupList;
