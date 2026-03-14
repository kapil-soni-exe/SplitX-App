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
import InviteLink from "../GroupList/InviteLink";

import { useCreateGroup } from "../../../../hooks/useCreateGroup";

// toast handler
import { showSuccessToast, showErrorToast } from "../../../../utils/toastHandler";

function GroupList({
  groups,
  selectedGroupId,
  onSelectGroup,
  onGroupCreated,
  currentUser,
}) {
  // hook for creating group
  const { create } = useCreateGroup();

  // search input state
  const [search, setSearch] = useState("");

  // modal open/close
  const [open, setOpen] = useState(false);

  // loading state to prevent multiple submissions
  const [loading, setLoading] = useState(false);

  // filter groups by search text
  const visibleSearch = filterGroupsBySearch(groups, search);

  // store created group after success
  const [createdGroup, setCreatedGroup] = useState(null);

  // store invite link after group creation
  const [inviteLink, setInviteLink] = useState(null);

  // create group handler
  const handleCreateGroup = async (name) => {
    try {
      setLoading(true);

      // call hook to create group
      const { group, inviteLink } = await create(name);

      // save group + invite link
      setCreatedGroup(group);
      setInviteLink(inviteLink);

      // update parent state
      onGroupCreated(group._id);

      // auto select created group
      onSelectGroup(group._id);

      // copy invite link automatically
      await navigator.clipboard.writeText(inviteLink);

      // success toast
      showSuccessToast("Group created 🎉 Invite link copied");

    } catch (err) {
      // show error toast
      showErrorToast(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-list-panel">
      {/* HEADER */}
      <div className="group-list-header">
        <h3>Groups</h3>

        {/* search input */}
        <div className="header-search">
          <GroupSearch
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* GROUP LIST BODY */}
      <div className="group-list-body">

        {/* Create group button */}
        <Button
          text="+"
          className="create-group-btn"
          onClick={() => setOpen(true)}
          disabled={loading}
        />

        {/* Modal for create group / invite link */}
        <Modal
          isOpen={open}
          onClose={() => {
            setOpen(false);

            // reset state when modal closes
            setCreatedGroup(null);
            setInviteLink(null);
          }}
        >
          {/* show create group form first */}
          {!createdGroup ? (
            <CreateGroup onCreate={handleCreateGroup} />
          ) : (
            // after creation show invite link
            <InviteLink inviteLink={inviteLink} />
          )}
        </Modal>

        {/* Render groups */}
        {visibleSearch.map((group) => {
          const isActive = group._id === selectedGroupId;

          return (
            <div
              key={group._id}
              className={`group-list-item ${isActive ? "active" : ""}`}
              onClick={() => onSelectGroup(group._id)}
            >
              {/* group avatar */}
              <div className="group-avatar">{group.name[0]}</div>

              <div className="group-info">
                {/* group name */}
                <p className="group-name">{group.name}</p>

                {/* last activity preview */}
                <span className="group-meta">
                  <span className="group-preview-text">
                    {group.lastExpense
                      ? getLastActivity(group, currentUser?.id)
                      : "No activity yet"}
                  </span>

                  {/* activity time */}
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