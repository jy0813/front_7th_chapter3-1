import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import type { UseFormReturn, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userCreateSchema } from '../schemas/user.schema';
import { postCreateSchema } from '../schemas/post.schema';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import type { User } from '../services/userService';
import type { Post } from '../services/postService';
import type { EntityType } from './useManagementTab';

type Entity = User | Post;

// FormData는 user와 post 필드를 모두 optional로 포함
type FormData = {
  // user fields
  username?: string;
  email?: string;
  role?: 'user' | 'moderator' | 'admin';

  // post fields
  title?: string;
  author?: string;
  category?: 'development' | 'design' | 'accessibility';
  content?: string;

  // shared field (string으로 해서 둘 다 허용)
  status?: string;
};

const isUser = (item: Entity): item is User => {
  return 'username' in item && 'email' in item;
};

const isPost = (item: Entity): item is Post => {
  return 'title' in item && 'content' in item;
};

interface UseManagementFormParams {
  entityType: EntityType;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onDataChange?: () => void;
}

interface UseManagementFormReturn {
  form: UseFormReturn<FormData>;
  handleCreate: (data: FormData) => Promise<void>;
  handleUpdate: (data: FormData, item: Entity) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  handleStatusAction: (
    id: number,
    action: 'publish' | 'archive' | 'restore',
  ) => Promise<void>;
  resetForm: () => void;
  loadFormData: (item: Entity) => void;
}

export function useManagementForm({
  entityType,
  onSuccess,
  onError,
  onDataChange,
}: UseManagementFormParams): UseManagementFormReturn {
  const schema = entityType === 'user' ? userCreateSchema : postCreateSchema;

  // zodResolver를 Resolver<FormData>로 타입 캐스팅
  const resolver: Resolver<FormData> = zodResolver(
    schema,
  ) as Resolver<FormData>;

  const form = useForm<FormData>({
    resolver,
    mode: 'onChange',
    defaultValues: {
      // user fields - 항상 초기값 설정 (undefined 방지)
      username: '',
      email: '',
      role: 'user',
      // post fields - 항상 초기값 설정 (undefined 방지)
      title: '',
      author: '',
      category: undefined,
      content: '',
      // shared field
      status: entityType === 'user' ? 'active' : 'draft',
    },
  });

  const resetForm = () => {
    form.reset({
      // user fields
      username: '',
      email: '',
      role: 'user',
      // post fields
      title: '',
      author: '',
      category: undefined,
      content: '',
      // shared field
      status: entityType === 'user' ? 'active' : 'draft',
    });
  };

  // entityType 변경 시 form reset
  useEffect(() => {
    form.reset({
      username: '',
      email: '',
      role: 'user',
      title: '',
      author: '',
      category: undefined,
      content: '',
      status: entityType === 'user' ? 'active' : 'draft',
    });
  }, [entityType, form]);

  const loadFormData = (item: Entity) => {
    if (entityType === 'user' && isUser(item)) {
      form.reset({
        // user fields - item 값 사용
        username: item.username,
        email: item.email,
        role: item.role,
        status: item.status,
        // post fields - 빈 값으로 초기화
        title: '',
        author: '',
        category: undefined,
        content: '',
      });
    } else if (entityType === 'post' && isPost(item)) {
      form.reset({
        // user fields - 빈 값으로 초기화
        username: '',
        email: '',
        role: 'user',
        // post fields - item 값 사용
        title: item.title,
        content: item.content,
        author: item.author,
        category: item.category,
        status: item.status,
      });
    }
  };

  const handleCreate = async (formData: FormData) => {
    try {
      if (entityType === 'user') {
        await userService.create({
          username: formData.username!,
          email: formData.email!,
          role: formData.role || 'user',
          status:
            (formData.status as 'active' | 'inactive' | 'suspended') ||
            'active',
        });
      } else {
        await postService.create({
          title: formData.title!,
          content: formData.content || '',
          author: formData.author!,
          category: formData.category!,
          status:
            (formData.status as 'draft' | 'published' | 'archived') || 'draft',
        });
      }

      if (onDataChange) await onDataChange();
      resetForm();
      if (onSuccess) {
        onSuccess(
          `${entityType === 'post' ? '게시글' : '사용자'}이(가) 생성되었습니다`,
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '생성에 실패했습니다';
      if (onError) onError(message);
    }
  };

  const handleUpdate = async (formData: FormData, selectedItem: Entity) => {
    if (!selectedItem) return;

    try {
      if (entityType === 'user' && isUser(selectedItem)) {
        const updateData: Partial<Omit<User, 'id' | 'createdAt'>> = {
          username: formData.username!,
          email: formData.email!,
          role: formData.role,
          status: formData.status as 'active' | 'inactive' | 'suspended',
        };
        await userService.update(selectedItem.id, updateData);
      } else if (entityType === 'post' && isPost(selectedItem)) {
        const updateData: Partial<Omit<Post, 'id' | 'createdAt' | 'views'>> = {
          title: formData.title!,
          content: formData.content,
          author: formData.author!,
          category: formData.category!,
          status: formData.status as 'draft' | 'published' | 'archived',
        };
        await postService.update(selectedItem.id, updateData);
      }

      if (onDataChange) await onDataChange();
      resetForm();
      if (onSuccess) {
        onSuccess(
          `${entityType === 'post' ? '게시글' : '사용자'}이(가) 수정되었습니다`,
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '수정에 실패했습니다';
      if (onError) onError(message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      if (entityType === 'user') {
        await userService.delete(id);
      } else {
        await postService.delete(id);
      }

      if (onDataChange) await onDataChange();
      if (onSuccess) onSuccess('삭제되었습니다');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '삭제에 실패했습니다';
      if (onError) onError(message);
    }
  };

  const handleStatusAction = async (
    id: number,
    action: 'publish' | 'archive' | 'restore',
  ) => {
    if (entityType !== 'post') return;

    try {
      if (action === 'publish') {
        await postService.publish(id);
      } else if (action === 'archive') {
        await postService.archive(id);
      } else if (action === 'restore') {
        await postService.restore(id);
      }

      if (onDataChange) await onDataChange();
      const message =
        action === 'publish' ? '게시' : action === 'archive' ? '보관' : '복원';
      if (onSuccess) onSuccess(`${message}되었습니다`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '작업에 실패했습니다';
      if (onError) onError(message);
    }
  };

  return {
    form,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleStatusAction,
    resetForm,
    loadFormData,
  };
}
