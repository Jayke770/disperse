import { InjectedConnector } from '@web3-react/injected-connector'
const injected = new InjectedConnector({
    supportedChainIds: [1, 888]
})
const connectors = {
    injected: injected
}
export default connectors