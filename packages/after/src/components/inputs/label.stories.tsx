import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './label';
import { Input } from './input';

const meta = {
  title: 'Inputs/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <Label>Label Text</Label>,
};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '300px' }}>
      <Label htmlFor="example">Email Address</Label>
      <Input id="example" type="email" placeholder="name@example.com" />
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '300px' }}>
      <Label htmlFor="required">
        Username <span className="text-destructive">*</span>
      </Label>
      <Input id="required" placeholder="Enter username" required />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '300px' }}>
      <div data-disabled="true" className="group">
        <Label htmlFor="disabled">Disabled Field</Label>
        <Input id="disabled" placeholder="This field is disabled" disabled />
      </div>
    </div>
  ),
};

export const MultipleFields: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '300px' }}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="first-name">First Name</Label>
        <Input id="first-name" placeholder="John" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="last-name">Last Name</Label>
        <Input id="last-name" placeholder="Doe" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email-field">Email</Label>
        <Input id="email-field" type="email" placeholder="john@example.com" />
      </div>
    </div>
  ),
};
