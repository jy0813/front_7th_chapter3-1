import { Button } from '@/components/inputs/button';
import { Alert } from '@/components/feedback/alert';
import { TabsContent } from '@/components/navigation/tabs';
import { Card, CardContent } from '@/components/surfaces/card';
import { useManagementTab } from '@/hooks/useManagementTab';
import { useManagementForm } from '@/hooks/useManagementForm';
import { useManagementData } from '@/hooks/useManagementData';
import { useManagementActions } from '@/hooks/useManagementActions';
import { useAlert } from '@/hooks/useAlert';
import { useModal } from '@/hooks/useModal';
import { EntityTypeTabs } from '@/components/domains/management/management-tabs';
import { ManagementStats } from '@/components/domains/management/management-stats';
import { ManagementTable } from '@/components/domains/management/management-table';
import { ManagementDialog } from '@/components/domains/management/management-dialog';
import type { User } from '../services/userService';
import type { Post } from '../services/postService';
type Entity = User | Post;
export const ManagementPage = () => {
  const { alert, showSuccess, showError, hideAlert } = useAlert();

  // 탭 관리
  const { entityType, handleTabChange } = useManagementTab({
    initialType: 'post',
    onTabChange: hideAlert, // 탭 변경 시 Alert 숨기기
  });
  const createModal = useModal<Entity>();
  const editModal = useModal<Entity>();
  const { data, loadData } = useManagementData({
    entityType,
    onError: showError,
  });
  const {
    form,
    handleCreate: createEntity,
    handleUpdate: updateEntity,
    handleDelete: deleteEntity,
    handleStatusAction: statusActionEntity,
    loadFormData,
    resetForm,
  } = useManagementForm({
    entityType,
    onSuccess: showSuccess,
    onError: showError,
    onDataChange: loadData,
  });
  const {
    handleCreate,
    handleEdit,
    handleCreateSubmit,
    handleUpdateSubmit,
    handleCancelCreate,
    handleCancelEdit,
    handleDelete,
    handleStatusAction,
  } = useManagementActions({
    form,
    loadFormData,
    resetForm,
    createEntity,
    updateEntity,
    deleteEntity,
    statusActionEntity,
    createModal,
    editModal,
  });
  return (
    <>
      <div className="mx-auto max-w-[1200px] p-5">
        <div className="mb-5">
          <h1 className="text-foreground mb-1.5 text-2xl font-bold">
            관리 시스템
          </h1>
          <p className="text-foreground-muted text-sm">
            사용자와 게시글을 관리하세요
          </p>
        </div>
        <Card>
          <CardContent className="p-2.5">
            <EntityTypeTabs value={entityType} onValueChange={handleTabChange}>
              <TabsContent value={entityType} className="mt-8">
                <div className="mb-8 flex justify-end">
                  <Button variant="primary" size="md" onClick={handleCreate}>
                    새로 만들기
                  </Button>
                </div>
                {alert.isVisible && alert.type === 'success' && (
                  <div className="mb-2.5">
                    <Alert variant="success" title="성공" onClose={hideAlert}>
                      {alert.message}
                    </Alert>
                  </div>
                )}
                {alert.isVisible && alert.type === 'error' && (
                  <div className="mb-2.5">
                    <Alert variant="error" title="오류" onClose={hideAlert}>
                      {alert.message}
                    </Alert>
                  </div>
                )}
                <ManagementStats entityType={entityType} data={data} />
                <ManagementTable
                  entityType={entityType}
                  data={data}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusAction={handleStatusAction}
                />
              </TabsContent>
            </EntityTypeTabs>
          </CardContent>
        </Card>
      </div>
      <ManagementDialog
        mode="create"
        entityType={entityType}
        open={createModal.isOpen}
        onOpenChange={(open) =>
          open ? createModal.open() : createModal.close()
        }
        form={form}
        onSubmit={handleCreateSubmit}
        onCancel={handleCancelCreate}
      />
      <ManagementDialog
        mode="edit"
        entityType={entityType}
        open={editModal.isOpen}
        onOpenChange={(open) => (open ? editModal.open() : editModal.close())}
        selectedItem={editModal.selectedItem}
        form={form}
        onSubmit={handleUpdateSubmit}
        onCancel={handleCancelEdit}
      />
    </>
  );
};
