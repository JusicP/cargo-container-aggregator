import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { RAL } from "ral-colors/index"

type RalColorEntry = {
  description?: string;
  HEX: string;
  rgb?: { r: number; g: number; b: number };
  group?: string;
};

type RalColorBoxProps = {
  /** key in the colors object, e.g. "RAL1000" */
  ralColorKey: string;
  /** colors object to pull from */
  ralColors?: Record<string, RalColorEntry>;
  /** whether to show the hex and rgb values */
  showValues?: boolean;
  /** size of the square box */
  size?: number | string;
};

export default function RalColorBox({
  ralColorKey: colorKey,
  ralColors: colors = RAL.classic,
  showValues = false,
  size = 4,
}: RalColorBoxProps) {
  const color = colors[colorKey];

  if (!color) {
    return (
        <Text>{colorKey}</Text>
    );
  }

  const hex = color.HEX;
  const rgb = color.rgb ? `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}` : undefined;

  return (
    <HStack alignItems="center">
      {/* Color square */}
      <Box
        w={size}
        h={size}
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        boxShadow="sm"
        bg={hex}
        flexShrink={0}
      />

      {/* Text block */}
      <VStack align="start">
        <Flex gap={2} alignItems="baseline">
          <Text fontWeight="semibold">{colorKey}</Text>
          <Text fontSize="sm" color="gray.500">{color.description}</Text>
        </Flex>

        {showValues && (
          <Text fontSize="sm" color="gray.600">
            {hex} {rgb ? `• rgb(${rgb})` : ""}
          </Text>
        )}
      </VStack>
    </HStack>
  );
}
// Example usage:
// <ColorBox ralColorKey="RAL1000" />
// or
// <ColorBox ralColorKey="RAL1000" ralColors={yourImportedClassicObject} size={56} showValues={false} />
