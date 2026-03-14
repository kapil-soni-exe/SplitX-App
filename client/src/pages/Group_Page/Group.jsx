import React, { useEffect, useState } from "react";
import GroupList from "./components/GroupList/GroupList";
import "./Group.css";
import GroupDetails from "./components/GroupDetails/GroupDetails";
import { useOutletContext } from "react-router-dom";
import GroupInfo from "./components/GroupInfo/GroupInfo";
import { useAuth } from "../../context/AuthContext";
import { useGroupManager } from "../../hooks/useGroupManager";
import Spinner from "../../components/Loaders/Spinner";

function Group() {
  const { groups, selectedGroupId, selectGroup, addGroup, fetchGroups,handleGroupLeft } =
    useGroupManager();

  const [showChatMobile, setShowChatMobile] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const { user } = useAuth();
  const { setHideBottomBar } = useOutletContext();

  // 🔥 SINGLE SOURCE TO OPEN GROUP (DESKTOP + MOBILE)
  const openGroup = (groupId) => {
    selectGroup(groupId);

    if (window.innerWidth <= 768) {
      setShowChatMobile(true);
    }
  };

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
      {/* LEFT */}
      <div className={`groups-left ${showChatMobile ? "hide-mobile" : ""}`}>
        <GroupList
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={openGroup}     // ✅ IMPORTANT
          onGroupCreated={addGroup}     // ✅ IMPORTANT
          currentUser={user}
        />
      </div>

      {/* RIGHT */}
      <div className={`groups-right ${showChatMobile ? "show-mobile" : ""}`}>
        {selectedGroupId ? (
          <GroupDetails
            groupId={selectedGroupId}
            onBack={() => setShowChatMobile(false)}
            onOpenInfo={() => setShowGroupInfo(true)}
            onExpenseCreated={fetchGroups}
          />
        ) : (
          <Spinner/>
        )}
      </div>

      {/* INFO */}
      <div className={`groups-info ${showGroupInfo ? "show-info" : ""}`}>
        {showGroupInfo && selectedGroupId && (
          <GroupInfo
            groupId={selectedGroupId}
            onBack={() => setShowGroupInfo(false)}
            onGroupLeft={handleGroupLeft}
            onCloseChat={() => setShowChatMobile(false)}

          />
        )}
      </div>
    </div>
  );
}

export default Group;