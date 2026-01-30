import {
  Box,
  Button,
  ButtonIcon,
  Text,
  AvatarAccount,
  AvatarIcon,
  BadgeStatus,
  ButtonVariant,
  ButtonBaseSize,
  ButtonIconSize,
  IconName,
  AvatarBaseSize,
  BadgeStatusStatus,
} from '@metamask/design-system-react';

/**
 * Example component demonstrating MetaMask Design System components
 *
 * This component showcases various components from the MetaMask design system
 * including Box, Text, Button, Avatar, Badge, and Icon components.
 */
export function DesignSystemExample() {
  return (
    <Box className="p-6 space-y-6">
      {/* Header Section */}
      <Box className="space-y-2">
        <Text className="text-2xl font-bold">
          MetaMask Design System Example
        </Text>
        <Text className="text-gray-600">
          This page demonstrates the usage of MetaMask design system components in React.
        </Text>
      </Box>

      {/* Buttons Section */}
      <Box className="space-y-4">
        <Text className="text-xl font-semibold">Buttons</Text>
        <Box className="flex gap-3 flex-wrap">
          <Button variant={ButtonVariant.Primary} size={ButtonBaseSize.Md}>
            Primary Button
          </Button>
          <Button variant={ButtonVariant.Secondary} size={ButtonBaseSize.Md}>
            Secondary Button
          </Button>
          <Button variant={ButtonVariant.Tertiary} size={ButtonBaseSize.Md}>
            Tertiary Button
          </Button>
          <Button variant={ButtonVariant.Primary} size={ButtonBaseSize.Md} disabled>
            Disabled Button
          </Button>
        </Box>
      </Box>

      {/* Icon Buttons Section */}
      <Box className="space-y-4">
        <Text className="text-xl font-semibold">Icon Buttons</Text>
        <Box className="flex gap-3">
          <ButtonIcon iconName={IconName.Setting} ariaLabel="Settings" size={ButtonIconSize.Md} />
          <ButtonIcon iconName={IconName.Close} ariaLabel="Close" size={ButtonIconSize.Md} />
          <ButtonIcon iconName={IconName.Add} ariaLabel="Add" size={ButtonIconSize.Md} />
        </Box>
      </Box>

      {/* Avatars Section */}
      <Box className="space-y-4">
        <Text className="text-xl font-semibold">Avatars</Text>
        <Box className="flex gap-4 items-center">
          <AvatarAccount address="0x1234567890123456789012345678901234567890" size={AvatarBaseSize.Md} />
          <AvatarIcon iconName={IconName.Wallet} size={AvatarBaseSize.Md} />
        </Box>
      </Box>

      {/* Badges Section */}
      <Box className="space-y-4">
        <Text className="text-xl font-semibold">Badges</Text>
        <Box className="flex gap-4">
          <BadgeStatus status={BadgeStatusStatus.Active}>Active</BadgeStatus>
          <BadgeStatus status={BadgeStatusStatus.New}>New</BadgeStatus>
          <BadgeStatus status={BadgeStatusStatus.Attention}>Attention</BadgeStatus>
        </Box>
      </Box>

      {/* Card Example */}
      <Box className="p-6 bg-white rounded-lg shadow-md space-y-3">
        <Box className="flex items-center gap-3">
          <AvatarIcon iconName={IconName.Wallet} size={AvatarBaseSize.Lg} />
          <Box>
            <Text className="font-semibold text-lg">Wallet Connected</Text>
            <Text className="text-gray-600 text-sm">
              Your wallet is successfully connected to the application
            </Text>
          </Box>
        </Box>
        <Box className="flex gap-2">
          <Button variant={ButtonVariant.Primary} size={ButtonBaseSize.Sm}>
            View Details
          </Button>
          <Button variant={ButtonVariant.Tertiary} size={ButtonBaseSize.Sm}>
            Disconnect
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
