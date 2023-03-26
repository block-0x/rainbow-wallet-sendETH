import React, {useState, useEffect} from 'react';
import {
  FormControl,
  Input,
  Button,
  FormHelperText,
  FormErrorMessage
} from '@chakra-ui/react'
import { Signer, Contract, utils, BigNumber } from 'ethers';
import { useAccount} from 'wagmi';
import { fetchSigner } from '@wagmi/core'
const erc20ABI = require("../ABI/TestToken.json").abi

type FetchSignerResult<TSigner extends Signer = Signer> = TSigner | null;
export function SendUSDT() {
  const [usdtAmount, setUsdtAmount] = useState<Number>(0)
  const depositAddress = process.env.NEXT_PUBLIC_DEPOSIT_ADDRESS || "";
  const { isConnected, address } = useAccount()

  const onError = (error: any) => {
    console.error(error?.data?.message)
  }

  async function bundleSend() {
    if (isConnected && address) {
      try {
        const signer: FetchSignerResult<Signer> = await fetchSigner();
        const usdt: Contract = await new Contract(
          "0x0C8D64BfEE3c2D8e946c127E1Eb532CC99ABa9F6", erc20ABI
        );

        const quantity: BigNumber = utils.parseUnits(usdtAmount.toString(), "ether");
        const dataRow: string = await usdt.interface.encodeFunctionData("transfer", [
          depositAddress, quantity,
        ]);

        console.log("dataRow = ", dataRow)

        await signer?.sendTransaction({
          to: usdt.address,
          data: dataRow,
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  const [input, setInput] = useState('')
  const isError = input === ''

  return (
    <>
      <h4>{"Buy at USDT"}</h4>
      <FormControl isInvalid={isError} mt={6}>
          <Input
            className="input"
            placeholder='MIN 50000 USDT'
            maxLength={20}
            onChange={(e) =>
              {if (typeof e.target.value === 'number') {
                setUsdtAmount(parseInt(e.target.value))}
              }}
          />
      {!isError ? (
        <FormHelperText>
        </FormHelperText>
      ) : (
        <FormErrorMessage></FormErrorMessage>
      )}
        </FormControl>

      <Button className="button" mt={4} colorScheme='teal' onClick={() => bundleSend()}>
        {'DEPOSIT USDT'}
      </Button>
    </>
  );
}
