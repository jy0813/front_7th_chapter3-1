import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="tab1" style={{ width: '400px' }}>
      <TabsList>
        <TabsTrigger value="tab1">첫 번째 탭</TabsTrigger>
        <TabsTrigger value="tab2">두 번째 탭</TabsTrigger>
        <TabsTrigger value="tab3">세 번째 탭</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="bg-background-subtle rounded-md p-4">
          <p className="typo-body-base">첫 번째 탭의 콘텐츠입니다.</p>
        </div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="bg-background-subtle rounded-md p-4">
          <p className="typo-body-base">두 번째 탭의 콘텐츠입니다.</p>
        </div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="bg-background-subtle rounded-md p-4">
          <p className="typo-body-base">세 번째 탭의 콘텐츠입니다.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="enabled1" style={{ width: '400px' }}>
      <TabsList>
        <TabsTrigger value="enabled1">Enabled 1</TabsTrigger>
        <TabsTrigger value="enabled2">Enabled 2</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="enabled1">
        <div className="bg-background-subtle rounded-md p-4">
          <p className="typo-body-base">Enabled 1 콘텐츠</p>
        </div>
      </TabsContent>
      <TabsContent value="enabled2">
        <div className="bg-background-subtle rounded-md p-4">
          <p className="typo-body-base">Enabled 2 콘텐츠</p>
        </div>
      </TabsContent>
      <TabsContent value="disabled">
        <div className="bg-background-subtle rounded-md p-4">
          <p className="typo-body-base">This tab is disabled</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};
