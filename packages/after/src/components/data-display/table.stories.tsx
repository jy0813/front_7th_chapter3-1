import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from './table';
import { Badge } from './badge';

const meta = {
  title: 'Data Display/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'striped', 'bordered', 'hover'],
      description: 'Table의 시각적 스타일을 결정합니다.',
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob Johnson</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>Editor</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Striped: Story = {
  render: () => (
    <Table variant="striped">
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow striped>
          <TableCell>Laptop</TableCell>
          <TableCell>$999</TableCell>
          <TableCell>15</TableCell>
        </TableRow>
        <TableRow striped>
          <TableCell>Mouse</TableCell>
          <TableCell>$29</TableCell>
          <TableCell>50</TableCell>
        </TableRow>
        <TableRow striped>
          <TableCell>Keyboard</TableCell>
          <TableCell>$79</TableCell>
          <TableCell>30</TableCell>
        </TableRow>
        <TableRow striped>
          <TableCell>Monitor</TableCell>
          <TableCell>$399</TableCell>
          <TableCell>8</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Bordered: Story = {
  render: () => (
    <Table variant="bordered">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>Project Alpha</TableCell>
          <TableCell>
            <Badge variant="success">Active</Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2</TableCell>
          <TableCell>Project Beta</TableCell>
          <TableCell>
            <Badge variant="warning">Pending</Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>3</TableCell>
          <TableCell>Project Gamma</TableCell>
          <TableCell>
            <Badge variant="destructive">Inactive</Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <Table variant="hover">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Salary</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow hoverable>
          <TableCell>Alice Kim</TableCell>
          <TableCell>Engineering</TableCell>
          <TableCell>$120,000</TableCell>
        </TableRow>
        <TableRow hoverable>
          <TableCell>Bob Lee</TableCell>
          <TableCell>Design</TableCell>
          <TableCell>$100,000</TableCell>
        </TableRow>
        <TableRow hoverable>
          <TableCell>Carol Park</TableCell>
          <TableCell>Marketing</TableCell>
          <TableCell>$90,000</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of recent transactions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>2024-01-15</TableCell>
          <TableCell>Payment received</TableCell>
          <TableCell>+$500</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2024-01-14</TableCell>
          <TableCell>Subscription fee</TableCell>
          <TableCell>-$29</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2024-01-13</TableCell>
          <TableCell>Refund</TableCell>
          <TableCell>+$150</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
