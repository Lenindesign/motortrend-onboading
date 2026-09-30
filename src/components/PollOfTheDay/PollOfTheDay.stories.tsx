import type { Meta, StoryObj } from '@storybook/react-vite';
import { PollOfTheDay } from './PollOfTheDay';
import '../../design-system/global.css';

const meta = {
  title: 'Vehicle Details/Poll of the Day',
  component: PollOfTheDay,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['horizontal', 'sidebar'],
    },
    previewBeforeVote: { control: 'boolean' },
    showPhotos: { control: 'boolean' },
  },
  args: {
    variant: 'horizontal',
    previewBeforeVote: true,
    showPhotos: true,
  },
} satisfies Meta<typeof PollOfTheDay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HorizontalWithPhotos: Story = {
  name: 'Horizontal · Not voted · With photos',
  args: {
    variant: 'horizontal',
    previewBeforeVote: true,
    showPhotos: true,
  },
};

export const HorizontalWithoutPhotos: Story = {
  name: 'Horizontal · Not voted · No photos',
  args: {
    variant: 'horizontal',
    previewBeforeVote: true,
    showPhotos: false,
  },
};

export const SidebarWithPhotos: Story = {
  name: 'Sidebar · Not voted · With photos',
  args: {
    variant: 'sidebar',
    previewBeforeVote: true,
    showPhotos: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(100%, 320px)' }}>
        <Story />
      </div>
    ),
  ],
};

export const Interactive: Story = {
  name: 'Horizontal · Interactive',
  args: {
    variant: 'horizontal',
    previewBeforeVote: false,
    showPhotos: true,
  },
};
