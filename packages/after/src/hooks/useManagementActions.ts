import { useCallback } from 'react';
import type { User } from '../services/userService';
import type { Post } from '../services/postService';
import type { UseFormReturn } from 'react-hook-form';

type Entity = User | Post;

interface FormData {
  username?: string;
  email?: string;
  role?: 'user' | 'moderator' | 'admin';
  title?: string;
  author?: string;
  category?: 'development' | 'design' | 'accessibility';
  content?: string;
  status?: string;
}

interface UseManagementActionsParams {
  form: UseFormReturn<FormData>;
  loadFormData: (item: Entity) => void;
  resetForm: () => void;
  createEntity: (data: FormData) => Promise<void>;
  updateEntity: (data: FormData, item: Entity) => Promise<void>;
  deleteEntity: (id: number) => Promise<void>;
  statusActionEntity: (
    id: number,
    action: 'publish' | 'archive' | 'restore',
  ) => Promise<void>;
  createModal: {
    isOpen: boolean;
    open: (item?: Entity) => void;
    close: () => void;
  };
  editModal: {
    isOpen: boolean;
    selectedItem: Entity | null;
    open: (item?: Entity) => void;
    close: () => void;
  };
}

interface UseManagementActionsReturn {
  handleEdit: (item: Entity) => void;
  handleCreateSubmit: (formData: FormData) => Promise<void>;
  handleUpdateSubmit: (formData: FormData) => Promise<void>;
  handleCancelCreate: () => void;
  handleCancelEdit: () => void;
  handleCreate: () => void;
  handleDelete: (id: number) => Promise<void>;
  handleStatusAction: (
    id: number,
    action: 'publish' | 'archive' | 'restore',
  ) => Promise<void>;
}

export function useManagementActions({
  loadFormData,
  resetForm,
  createEntity,
  updateEntity,
  deleteEntity,
  statusActionEntity,
  createModal,
  editModal,
}: UseManagementActionsParams): UseManagementActionsReturn {
  const handleCreate = useCallback(() => {
    createModal.open();
  }, [createModal]);

  const handleEdit = useCallback(
    (item: Entity) => {
      loadFormData(item);
      editModal.open(item);
    },
    [loadFormData, editModal],
  );

  const handleCreateSubmit = useCallback(
    async (formData: FormData) => {
      await createEntity(formData);
      createModal.close();
    },
    [createEntity, createModal],
  );

  const handleUpdateSubmit = useCallback(
    async (formData: FormData) => {
      if (!editModal.selectedItem) return;
      await updateEntity(formData, editModal.selectedItem);
      editModal.close();
    },
    [updateEntity, editModal],
  );

  const handleCancelCreate = useCallback(() => {
    createModal.close();
    resetForm();
  }, [createModal, resetForm]);

  const handleCancelEdit = useCallback(() => {
    editModal.close();
    resetForm();
  }, [editModal, resetForm]);

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteEntity(id);
    },
    [deleteEntity],
  );

  const handleStatusAction = useCallback(
    async (id: number, action: 'publish' | 'archive' | 'restore') => {
      await statusActionEntity(id, action);
    },
    [statusActionEntity],
  );

  return {
    handleCreate,
    handleEdit,
    handleCreateSubmit,
    handleUpdateSubmit,
    handleCancelCreate,
    handleCancelEdit,
    handleDelete,
    handleStatusAction,
  };
}
