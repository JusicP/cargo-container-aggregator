"use client"

import { ChakraProvider } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { createSystem, defaultConfig } from "@chakra-ui/react"

// modifying default styling ui system to include now new custom font
const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: "Alexandria Variable" },
        body: { value: "system-ui, sans-serif" },
        system: { value: "system-ui, sans-serif" },
      },
    },
    semanticTokens: {
      shadows: {
        custom: {
          value: {
            _light: "0 3px 6px 0 rgba(0, 0, 0, 0.25)",
            _dark: "0 3px 6px 0 rgba(0, 0, 0, 0.25)",
          },
        },
      },
    },
  },
})

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
