import React, { useState} from 'react';
import { useSendTransaction, useWaitForTransaction } from 'wagmi'
import {
  FormControl,
  Input,
  Button,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react'
import { parseEther } from 'ethers/lib/utils.js';

export function SendETH() {
  const [ethAmount, setEthAmount] = useState<Number>(0)
  const depositAddress = process.env.NEXT_PUBLIC_DEPOSIT_ADDRESS || "";

    const onError = (error: any) => {
      console.error(error?.data?.message)
    }

    const {
      data: txData,
      isLoading: transactionLoading,
      sendTransaction
  } = useSendTransaction({
      request: {},
      mode: 'recklesslyUnprepared',
      onError
  });

    const { isLoading: waitLoading } = useWaitForTransaction({

      hash: txData?.hash,
      onSuccess: () => {
        console.log("successfully")
        console.log(waitLoading)
        console.log(transactionLoading)
      },
      onError
    });

  const [input, setInput] = useState('')
  const isError = input === ''

  return (
    <>
      <h4>{"Buy at ETH"}</h4>
      <FormControl isInvalid={isError} mt={6}>
        <Input
          className="input"
          placeholder='MIN 30 ETH'
          maxLength={20}
          onChange={(e) =>
            {if (typeof e.target.value === 'number') {
              setEthAmount(parseInt(e.target.value))}
            }}
        />
        {!isError ? (
          <FormHelperText>
          </FormHelperText>
        ) : (
          <FormErrorMessage></FormErrorMessage>
        )}
        <Button className="button" mt={4} colorScheme='teal' onClick={() => sendTransaction?.({
            recklesslySetUnpreparedRequest: {
              to: depositAddress,
              value: parseEther(ethAmount.toString())
            }
        })}>
        {'DEPOSIT ETH'}
        </Button>
      </FormControl>
    </>
  );
}
