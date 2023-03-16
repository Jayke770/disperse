import '../styles/globals.css'
import { createTheme, NextUIProvider, useSSR } from "@nextui-org/react"
import type { AppProps } from 'next/app'
import Web3 from 'web3'
import { Web3ReactProvider } from '@web3-react/core'
const theme = createTheme({
  type: "dark",
  theme: {
    colors: {
      primary: '#2afe30',
    },
  }
})
export default function Disperse({ Component, pageProps }: AppProps) {
  const { isBrowser } = useSSR()
  return (
    isBrowser && (
      <Web3ReactProvider getLibrary={(provider) => new Web3(provider)}>
        <NextUIProvider theme={theme}>
          <Component {...pageProps} />
        </NextUIProvider>
      </Web3ReactProvider>
    )
  )
}