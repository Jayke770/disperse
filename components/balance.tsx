import { Text } from "@nextui-org/react"
import { useEffect, useState } from "react"
import type Web3 from 'web3'
export default function Balance({ web3, address }: { web3: Web3, address: string }) {
    const [balance, setBalance] = useState<number>(0)
    const onGetBalance = async () => {
        const userBalance = parseFloat(parseFloat(web3.utils.fromWei(await web3?.eth.getBalance(address), 'ether')).toFixed(2))
        setBalance(userBalance)
    }
    useEffect(() => {
        onGetBalance()
    }, [onGetBalance])
    console.log(balance)
    return (
        <Text
            size={"$sm"}
            css={{
                marginLeft: "$2"
            }}>
            {balance} $TEAM
        </Text>
    )
}