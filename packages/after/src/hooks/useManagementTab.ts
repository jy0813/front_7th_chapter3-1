import { useState, useCallback } from 'react';

export type EntityType = 'user' | 'post';

interface UseManagementTabParams {
  onTabChange?: (newType: EntityType) => void;
  initialType?: EntityType;
}

interface UseManagementTabReturn {
  entityType: EntityType;
  handleTabChange: (value: string) => void;
}

/**
 * Management Tab의 비즈니스 로직을 관리하는 Custom Hook
 *
 * @description
 * - entityType state 관리
 * - Tab 변경 시 onTabChange callback 호출
 * - UI와 비즈니스 로직 분리를 위한 hook
 *
 * @example
 * ```tsx
 * const { entityType, handleTabChange } = useManagementTab({
 *   onTabChange: (newType) => {
 *     loadData();
 *     form.reset();
 *   }
 * });
 * ```
 */
export function useManagementTab(
  params?: UseManagementTabParams,
): UseManagementTabReturn {
  const { onTabChange, initialType = 'post' } = params || {};

  const [entityType, setEntityType] = useState<EntityType>(initialType);

  const handleTabChange = useCallback(
    (value: string) => {
      const newType = value as EntityType;
      setEntityType(newType);

      if (onTabChange) {
        onTabChange(newType);
      }
    },
    [onTabChange],
  );

  return {
    entityType,
    handleTabChange,
  };
}
