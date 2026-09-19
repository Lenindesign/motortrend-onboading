/**
 * Shared MotorTrend icon component.
 *
 * Existing semantic names are retained at call sites while rendering is
 * standardized on the Phosphor icon family and its weight system.
 */

import React from 'react';
import {
  ArrowBendLeftUp, ArrowBendUpLeft, ArrowClockwise, ArrowDown, ArrowRight, ArrowSquareOut, ArrowUp,
  ArrowsClockwise, ArrowsIn, ArrowsOut, Article, Bell, Blueprint, Bookmark, BookmarkSimple, Cake, Calendar,
  CalendarBlank, CalendarCheck, CalendarDots, CalendarX, Car, CaretDown, CaretLeft, CaretRight, CaretUp,
  ChartBar, ChartLineUp, Chat, ChatCircle, ChatCircleDots, ChatCircleText, ChatsCircle, Check, CheckCircle,
  Circle, Clock, ClockCounterClockwise, Compass, Copy, Cube, DotsSixVertical, Eye, EyeSlash, Faders, FileText,
  Flame, Gear, Globe, GridFour, HandSwipeRight, Heart, House, Image, Images, Info, Lightning, List, MagicWand,
  MagnifyingGlass, MagnifyingGlassMinus, MapPin, Megaphone, Minus, Newspaper, Note, NotePencil, Palette,
  PaperPlaneTilt, PencilSimple, PlayCircle, Plus, PlusCircle, PuzzlePiece, Question, Quotes, Rows, ShareNetwork,
  SignIn, SignOut, Signpost, SortAscending, Sparkle, Speedometer, SquaresFour, Star, Storefront, Tag, TextAa,
  ThumbsDown, ThumbsUp, Ticket, Trash, TrendUp, Trophy, UploadSimple, User, UserCircle, Users, Warning, WarningCircle,
} from '@phosphor-icons/react';

export type IconVariant = 'outlined' | 'filled' | 'rounded' | 'sharp';

export interface IconProps {
  name: string;
  variant?: IconVariant;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

type PhosphorIcon = React.ComponentType<{
  size?: number | string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  className?: string;
  style?: React.CSSProperties;
  'aria-hidden'?: boolean;
}>;

// Keep Material-compatible names at call sites while using Phosphor globally.
const iconMap: Record<string, string> = {
  account_circle: 'UserCircle', add: 'Plus', add_circle: 'PlusCircle', add_circle_outline: 'PlusCircle',
  architecture: 'Blueprint', arrow_back: 'ArrowBendLeftUp', arrow_downward: 'ArrowDown', arrow_forward: 'ArrowRight', arrow_upward: 'ArrowUp',
  article: 'Article', auto_awesome: 'Sparkle', bolt: 'Lightning', bookmark: 'Bookmark', bookmark_border: 'BookmarkSimple', cake: 'Cake',
  calendar_today: 'CalendarBlank', chat_bubble_outline: 'ChatCircle', check: 'Check', check_circle: 'CheckCircle', chevron_left: 'CaretLeft', chevron_right: 'CaretRight',
  circle: 'Circle', close: 'X', close_fullscreen: 'ArrowsIn', comment: 'Chat', confirmation_number: 'Ticket', content_copy: 'Copy',
  dashboard: 'SquaresFour', dashboard_customize: 'SquaresFour', date_range: 'CalendarBlank', delete: 'Trash', description: 'FileText', directions_car: 'Car',
  drag_indicator: 'DotsSixVertical', edit: 'PencilSimple', edit_note: 'NotePencil', emoji_events: 'Trophy', error: 'WarningCircle', event: 'CalendarBlank',
  event_available: 'CalendarCheck', event_busy: 'CalendarX', event_note: 'Calendar', expand_less: 'CaretUp', expand_more: 'CaretDown', explore: 'Compass',
  extension: 'PuzzlePiece', favorite: 'Heart', format_quote: 'Quotes', forum: 'ChatCircleText', grid_view: 'GridFour', group: 'Users', help: 'Question',
  history: 'ClockCounterClockwise', home: 'House', image: 'Image', info: 'Info', input: 'SignIn', insights: 'ChartLineUp', keyboard_arrow_down: 'CaretDown',
  keyboard_arrow_up: 'CaretUp', leaderboard: 'ChartBar', list: 'List', local_activity: 'Ticket', local_fire_department: 'Flame', local_offer: 'Tag', location_on: 'MapPin',
  login: 'SignIn', logout: 'SignOut', new_releases: 'Megaphone', newspaper: 'Newspaper', notifications: 'Bell', open_in_full: 'ArrowsOut', open_in_new: 'ArrowSquareOut',
  palette: 'Palette', person: 'User', photo_library: 'Images', play_circle: 'PlayCircle', preview: 'Eye', question_answer: 'ChatCircleDots', radio_button_unchecked: 'Circle',
  rate_review: 'Note', refresh: 'ArrowClockwise', reply: 'ArrowBendUpLeft', restore: 'ClockCounterClockwise', reviews: 'ChatsCircle', route: 'Signpost', schedule: 'Clock',
  search: 'MagnifyingGlass', search_off: 'MagnifyingGlassMinus', send: 'PaperPlaneTilt', settings: 'Gear', share: 'ShareNetwork', smart_button: 'MagicWand', sort: 'SortAscending',
  space_bar: 'Minus', speed: 'Speedometer', star: 'Star', store: 'Storefront', swipe: 'HandSwipeRight', sync: 'ArrowsClockwise', text_fields: 'TextAa', thumb_down: 'ThumbsDown', thumb_up: 'ThumbsUp',
  trending_up: 'TrendUp', tune: 'Faders', upcoming: 'CalendarDots', upload: 'UploadSimple', view_agenda: 'Rows', visibility: 'Eye', visibility_off: 'EyeSlash', warning: 'Warning',
  web: 'Globe', widgets: 'Cube', workspaces: 'SquaresFour',
};

const phosphorIcons: Record<string, PhosphorIcon> = {
  ArrowBendLeftUp, ArrowBendUpLeft, ArrowClockwise, ArrowDown, ArrowRight, ArrowSquareOut, ArrowUp,
  ArrowsClockwise, ArrowsIn, ArrowsOut, Article, Bell, Blueprint, Bookmark, BookmarkSimple, Cake, Calendar,
  CalendarBlank, CalendarCheck, CalendarDots, CalendarX, Car, CaretDown, CaretLeft, CaretRight, CaretUp,
  ChartBar, ChartLineUp, Chat, ChatCircle, ChatCircleDots, ChatCircleText, ChatsCircle, Check, CheckCircle,
  Circle, Clock, ClockCounterClockwise, Compass, Copy, Cube, DotsSixVertical, Eye, EyeSlash, Faders, FileText,
  Flame, Gear, Globe, GridFour, HandSwipeRight, Heart, House, Image, Images, Info, Lightning, List, MagicWand,
  MagnifyingGlass, MagnifyingGlassMinus, MapPin, Megaphone, Minus, Newspaper, Note, NotePencil, Palette,
  PaperPlaneTilt, PencilSimple, PlayCircle, Plus, PlusCircle, PuzzlePiece, Question, Quotes, Rows, ShareNetwork,
  SignIn, SignOut, Signpost, SortAscending, Sparkle, Speedometer, SquaresFour, Star, Storefront, Tag, TextAa,
  ThumbsDown, ThumbsUp, Ticket, Trash, TrendUp, Trophy, UploadSimple, User, UserCircle, Users, Warning, WarningCircle,
};

const variantWeight: Record<IconVariant, 'regular' | 'fill'> = {
  outlined: 'regular', filled: 'fill', rounded: 'regular', sharp: 'regular',
};

export const Icon: React.FC<IconProps> = ({ name, variant = 'outlined', size = 24, className = '', style = {} }) => {
  const iconExport = iconMap[name] || 'Question';
  const PhosphorComponent = phosphorIcons[iconExport] || Question;

  return (
    <PhosphorComponent
      size={size}
      weight={variantWeight[variant]}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      aria-hidden={true}
    />
  );
};

export default Icon;
