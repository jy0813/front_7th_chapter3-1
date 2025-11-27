import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './textarea';
import { Label } from './label';

const meta = {
  title: 'Inputs/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fieldWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
      description: 'Textarea의 너비를 결정합니다.',
    },
    disabled: {
      control: 'boolean',
      description: 'Textarea의 비활성화 상태를 결정합니다.',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '400px' }}>
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Type your message here..." rows={4} />
    </div>
  ),
};

export const Small: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="small">Small Width</Label>
      <Textarea
        id="small"
        fieldWidth="sm"
        placeholder="Small textarea"
        rows={3}
      />
    </div>
  ),
};

export const Medium: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="medium">Medium Width</Label>
      <Textarea
        id="medium"
        fieldWidth="md"
        placeholder="Medium textarea"
        rows={3}
      />
    </div>
  ),
};

export const Large: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="large">Large Width</Label>
      <Textarea
        id="large"
        fieldWidth="lg"
        placeholder="Large textarea"
        rows={3}
      />
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '100%' }}>
      <Label htmlFor="full">Full Width</Label>
      <Textarea
        id="full"
        fieldWidth="full"
        placeholder="Full width textarea"
        rows={4}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '400px' }}>
      <Label htmlFor="disabled">Disabled Textarea</Label>
      <Textarea
        id="disabled"
        placeholder="This textarea is disabled"
        disabled
        rows={4}
      />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '400px' }}>
      <Label htmlFor="error">Feedback</Label>
      <Textarea
        id="error"
        placeholder="Enter your feedback..."
        className="border-destructive focus:ring-destructive"
        rows={4}
      />
      <p className="typo-helper-text text-destructive">
        Feedback must be at least 10 characters long.
      </p>
    </div>
  ),
};
