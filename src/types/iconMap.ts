import { Bell, Check, Globe, Home, Keyboard, Link, Lock, Menu, MessageCircle, Paintbrush, Settings, Video, BarChart, Key } from 'lucide-react';

export const iconMap = {
  Bell,
  Check,
  Globe,
  Home,
  Keyboard,
  Link,
  Lock,
  Menu,
  MessageCircle,
  Paintbrush,
  Settings,
  Video,
  BarChart,
  Key,
};

export const getIcon = (iconName: keyof typeof iconMap) => {
  return iconMap[iconName] || null;
};
