import { Fragment, useEffect, useState } from 'react'
import {
  Container,
  Card,
  Dropdown,
  Textarea,
  Spacer,
  Text,
  Button,
  Row,
  Avatar,
  Badge,
  Col,
  Input,
  Loading,
} from '@nextui-org/react'
import Head from 'next/head'
import { useWeb3React } from '@web3-react/core'
import { Web3Connectors, Config, Web3Contract } from '@lib'
import { Layout, Balance } from '@components'
import type Web3 from 'web3'
import { useLocalstorageState } from 'rooks'
export default function Home() {
  const [isWalletConnected, setisWalletConnected] = useState<boolean>(false)
  const [data, setData] = useState<{ value?: string, isSending?: boolean }>()
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const { library, activate, active, account, deactivate } = useWeb3React()
  const onConnectWallet = async () => {
    try {
      setIsConnecting(true)
      await activate(Web3Connectors.injected)
      localStorage.setItem("wallet", "1")
      setisWalletConnected(true)
      setIsConnecting(false)
    } catch (e) {
      console.log(e)
      setIsConnecting(false)
    }
  }
  const onDisconnectWallet = async () => {
    try {
      deactivate()
      localStorage.setItem("wallet", "0")
      setisWalletConnected(false)
    } catch (e) {
      console.log(e)
    }
  }
  const onSend = async () => {
    try {
      if (account && active) {
        setData({ ...data, isSending: true })
        const web3: Web3 = library
        const recipients = data?.value?.replaceAll("\n", "").split(",")
        let addresses: string[] = [], amounts: any[] = [], total: number = 0
        recipients?.map(x => {
          const recipient = x.trim().split(" ")
          addresses = [...addresses, recipient[0]]
          amounts = [...amounts, web3.utils.toWei(recipient[1], 'ether')]
          total += parseFloat(recipient[1])
        })
        const contract = new web3.eth.Contract(Web3Contract.abi.contract as any, Web3Contract.TeamChain)
        await contract.methods.disperse$Team(addresses, amounts).send({ from: account, value: web3.utils.toWei(total.toString(), 'ether') })
        setData({ ...data, isSending: false })
      } else {
        throw new Error("Please connect you MetaMask First!")
      }
    } catch (e: any) {
      console.log(e)
      setData({ ...data, isSending: false })
    }
  }
  useEffect(() => {
    const isPrevConnected = localStorage.getItem("wallet") === '1'
    if (isPrevConnected) onConnectWallet()
  }, [isWalletConnected])
  return (
    <Fragment>
      <Head>
        <title>Disperse</title>
      </Head>
      <Container
        display={'flex'}
        css={{
          height: '100vh'
        }}
        alignItems='center'
        justify='center'>
        <Card
          aria-level={1}
          variant="bordered"
          css={{
            "@md": {
              "width": "450px"
            }
          }}>
          <Card.Body>
            <Container
              display='flex'
              justify="space-between"
              alignItems="center">
              <Text
                h2
                css={{
                  textGradient: "45deg, $blue600 -20%, $green600 50%",
                }}
                weight="bold">Disperse</Text>
              <Dropdown
                isBordered>
                <Dropdown.Button flat>Change Network</Dropdown.Button>
                <Dropdown.Menu
                  selectionMode="single"
                  aria-label="Actions"
                  selectedKeys={["teamchain"]}
                  disabledKeys={["eth"]}>
                  <Dropdown.Item
                    key="teamchain">Team Chain</Dropdown.Item>
                  <Dropdown.Item
                    key="eth">Ethereum</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Container>
            <Spacer y={1} />
            <Container
              css={{
                width: '100%'
              }}
              display="flex">
              {account && active && (
                <Fragment>
                  <Layout
                    className='fsaf'
                    css={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between"
                    }}>
                    <Layout css={{
                      display: "flex",
                      alignItems: "center",
                      justifyItems: 'center'
                    }}>
                      <Avatar
                        bordered
                        squared
                        color={"secondary"}
                        size="lg"
                        src={`https://www.gravatar.com/avatar/${Math.floor((Math.random() * 99999999) + 1)}?d=retro`} />
                      <Layout
                        css={{
                          marginLeft: "$2"
                        }}>
                        <Badge
                          size={"xs"}
                          variant={"flat"}
                          disableOutline
                          color="success">{Config.obscureStr(account)}</Badge>
                        <Balance web3={library} address={account} />
                      </Layout>
                    </Layout>
                    <Layout>
                      <Button
                        onPress={onDisconnectWallet}
                        auto
                        bordered
                        color={"error"}>Disconnect</Button>
                    </Layout>
                  </Layout>
                  <Spacer />
                </Fragment>
              )}
              <Textarea
                onChange={(e) => setData({ ...data, value: e.target.value })}
                value={data?.value}
                css={{
                  width: "100%"
                }}
                color={"primary"}
                bordered
                placeholder='address amount, ...'
                minRows={5} />
            </Container>
          </Card.Body>
          <Card.Footer>
            <Container
              display='flex'
              justify='center'
              css={{
                width: "100%"
              }}>
              {active ? (
                data?.isSending ? <Loading /> : (
                  <Button
                    onPress={onSend}
                    css={{
                      "@dark": {
                        "color": "$black"
                      },
                      width: "100%"
                    }}>Send</Button>
                )
              ) : (
                <Layout
                  css={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '$4',
                    width: '100%'
                  }}>
                  {isConnecting ? <Loading /> : (
                    <Button
                      onPress={onConnectWallet}
                      color={"gradient"}
                      css={{
                        width: "100%"
                      }}>Connect MetaMask</Button>
                  )}
                  <Text
                    css={{
                      textAlign: 'center'
                    }}>or</Text>
                  <Input
                    bordered
                    placeholder="Private Key"
                    clearable
                    color="primary" />
                  <Button
                    color="warning"
                    css={{
                      width: "100%"
                    }}>Save</Button>
                  <Spacer y={0.1} />
                </Layout>
              )}
            </Container>
          </Card.Footer>
        </Card>
      </Container>
    </Fragment>
  )
}