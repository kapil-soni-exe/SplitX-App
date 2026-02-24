import React, { useEffect, useState } from "react";
import GroupList from "./components/GroupList/GroupList";
import "./Group.css";
import GroupDetails from "./components/GroupDetails/GroupDetails";
import { useOutletContext } from "react-router-dom";
import GroupInfo from "./components/GroupInfo/GroupInfo";

import { useGroupManager } from "../../hooks/useGroupManager";

function Group() {
  const { groups, selectedGroupId, selectGroup, addGroup } =
    useGroupManager();

  const [showChatMobile, setShowChatMobile] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  const handleSelectGroup = (id) => {
    
    selectGroup(id);
    if (window.innerWidth <= 768) {
      setShowChatMobile(true);
    }
  };

  const { setHideBottomBar } = useOutletContext();

  useEffect(() => {
    if ((showChatMobile || showGroupInfo) && window.innerWidth <= 768) {
      setHideBottomBar(true);
    } else {
      setHideBottomBar(false);
    }

    return () => setHideBottomBar(false);
  }, [showChatMobile, showGroupInfo]);

  return (
    <div className="groups-page">
      <div className={`groups-left ${showChatMobile ? "hide-mobile" : ""}`}>
        <GroupList
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={handleSelectGroup}
          onGroupCreated={addGroup}
        />
      </div>

      <div className={`groups-right ${showChatMobile ? "show-mobile" : ""}`}>
        {selectedGroupId ? (
          <GroupDetails
            groupId={selectedGroupId}
            onBack={() => setShowChatMobile(false)}
            onOpenInfo={() => setShowGroupInfo(true)}
          />
        ) : (
          <div className="group-loading">Loading group…</div>
        )}
      </div>

      <div className={`groups-info ${showGroupInfo ? "show-info" : ""}`}>
        {showGroupInfo && selectedGroupId && (
          <GroupInfo
            groupId={selectedGroupId}
            onBack={() => setShowGroupInfo(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Group;
