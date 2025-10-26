"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
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
  },
})

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
