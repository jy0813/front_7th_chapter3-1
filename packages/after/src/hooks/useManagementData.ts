import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import type { User } from '../services/userService';
import type { Post } from '../services/postService';
import type { EntityType } from './useManagementTab';

type Entity = User | Post;

interface UseManagementDataParams {
  entityType: EntityType;
  onError?: (message: string) => void;
}

interface UseManagementDataReturn {
  data: Entity[];
  isLoading: boolean;
  loadData: () => Promise<void>;
}

export function useManagementData({
  entityType,
  onError,
}: UseManagementDataParams): UseManagementDataReturn {
  const [data, setData] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      let result: Entity[];

      if (entityType === 'user') {
        result = await userService.getAll();
      } else {
        result = await postService.getAll();
      }

      setData(result);
    } catch {
      if (onError) {
        onError('데이터를 불러오는데 실패했습니다');
      }
    } finally {
      setIsLoading(false);
    }
  }, [entityType, onError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    isLoading,
    loadData,
  };
}
