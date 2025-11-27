import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './alert';
import { useState } from 'react';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Alert의 시각적 스타일과 의미를 결정합니다.',
    },
    title: {
      control: 'text',
      description: 'Alert의 제목을 설정합니다.',
    },
    showIcon: {
      control: 'boolean',
      description: 'Alert 아이콘의 표시 여부를 결정합니다.',
    },
    onClose: {
      description: '닫기 버튼 클릭 시 호출되는 함수입니다.',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'This is an informational alert with useful information.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Your action was completed successfully!',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Please be aware of this important warning.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'An error occurred. Please try again.',
  },
};

export const WithTitle: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    children:
      'This alert has a title to provide more context about the message.',
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    showIcon: false,
    children: "This alert doesn't have an icon.",
  },
};

export const Dismissible: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) {
      return (
        <button
          className="padding-btn-sm typo-btn-sm btn-secondary rounded-btn cursor-pointer border"
          onClick={() => setIsOpen(true)}
        >
          Show Alert
        </button>
      );
    }

    return (
      <Alert {...args} onClose={() => setIsOpen(false)}>
        You can dismiss this alert by clicking the close button.
      </Alert>
    );
  },
  args: {
    variant: 'info',
    title: 'Dismissible Alert',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="info">This is an informational alert.</Alert>
      <Alert variant="success">This is a success alert.</Alert>
      <Alert variant="warning">This is a warning alert.</Alert>
      <Alert variant="error">This is an error alert.</Alert>
    </div>
  ),
};

export const WithTitles: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="info" title="Information">
        This alert has a title to provide more context.
      </Alert>
      <Alert variant="success" title="Success!">
        Your changes have been saved successfully.
      </Alert>
      <Alert variant="warning" title="Warning">
        This action cannot be undone. Please proceed with caution.
      </Alert>
      <Alert variant="error" title="Error">
        Failed to process your request. Please contact support.
      </Alert>
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    variant: 'warning',
    title: 'Important Notice',
    children:
      'This is a much longer alert message that demonstrates how the alert component handles multiple lines of text. The component should expand vertically to accommodate longer content while maintaining proper spacing and alignment of the icon, text, and close button. This ensures that even complex messages are displayed clearly and remain accessible to users.',
  },
};
