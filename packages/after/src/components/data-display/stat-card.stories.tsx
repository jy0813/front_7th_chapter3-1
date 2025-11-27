import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatCard } from './stat-card';

const meta = {
  title: 'Data Display/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'destructive', 'neutral'],
      description: 'StatCard의 시각적 스타일을 결정합니다.',
    },
    label: {
      control: 'text',
      description: '통계 항목의 라벨',
    },
    value: {
      control: 'text',
      description: '통계 값',
    },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Total Users',
    value: '12,345',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    label: 'Revenue',
    value: '$45,231',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    label: 'Pending',
    value: '23',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    label: 'Failed',
    value: '5',
  },
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    label: 'Views',
    value: '98.7K',
  },
};

export const AllVariants: Story = {
  args: {
    variant: 'primary',
    label: 'Total Users',
    value: '12,345',
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: '600px' }}>
      <StatCard variant="primary" label="Total Users" value="12,345" />
      <StatCard variant="success" label="Revenue" value="$45,231" />
      <StatCard variant="warning" label="Pending" value="23" />
      <StatCard variant="destructive" label="Failed" value="5" />
      <StatCard variant="neutral" label="Views" value="98.7K" />
      <StatCard variant="neutral" label="Downloads" value="1.2M" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const DashboardExample: Story = {
  args: {
    variant: 'primary',
    label: 'Total Revenue',
    value: '$142,580',
  },
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: '100%' }}>
      <h2 className="typo-heading-lg">Dashboard Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard variant="primary" label="Total Revenue" value="$142,580" />
        <StatCard variant="success" label="Active Users" value="8,234" />
        <StatCard variant="warning" label="Processing" value="45" />
        <StatCard variant="neutral" label="Page Views" value="234.5K" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard variant="success" label="Conversion Rate" value="3.24%" />
        <StatCard variant="primary" label="Avg. Order Value" value="$67.45" />
        <StatCard variant="neutral" label="Sessions" value="12,456" />
        <StatCard variant="destructive" label="Bounce Rate" value="42.3%" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
