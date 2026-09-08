import { useGroupManager } from "./useGroupManager";
import { useGroupDetail } from "./useGroupDetail";

export function useDashboard() {
  const {
    groups,
    selectedGroupId,
    selectGroup,
    addGroup,
    fetchGroups,
    handleGroupLeft,
    isLoading: groupsLoading,
  } = useGroupManager();

  const { group, loading: groupDetailLoading, error, refetch } = useGroupDetail(selectedGroupId);

  // Combined loading: jab tak groups list load ho rahi hai, YA groups list load ho chuki hai
  // lekin selectedGroupId abhi tak decide nahi hua (auto-select useEffect chalne wala hai),
  // YA group detail actually fetch ho raha hai — teeno cases me loading true rakho
  const stillDecidingGroup = groups.length > 0 && !selectedGroupId;
  const loading = groupsLoading || stillDecidingGroup || groupDetailLoading;

  return {
    groups,
    selectedGroupId,
    setSelectedGroupId: selectGroup,
    group,
    loading,
    error,
    refreshGroup: refetch,
  };
}