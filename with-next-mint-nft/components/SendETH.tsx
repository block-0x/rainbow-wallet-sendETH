import React, {useState} from 'react';
import { useSendTransaction, useWaitForTransaction } from 'wagmi'
import {
  FormLabel,
  FormControl,
  Input,
  Button,
  VStack,
  Box,
  FormHelperText,
  FormErrorMessage
} from '@chakra-ui/react'

import { parseEther } from 'ethers/lib/utils.js';

export function SendETH() {
  const [amount, setAmount] = useState<Number>(0.0001)
  const depositAddress = process.env.NEXT_PUBLIC_DEPOSIT_ADDRESS || "";

  const {
    data: txData,
    isLoading: transactionLoading,sendTransaction } = useSendTransaction({
      request: {
        to: depositAddress,
        value: parseEther(amount.toString())
      }
    })

  const { isLoading: waitLoading } = useWaitForTransaction({

    hash: txData?.hash,
    onSuccess: () => {
      console.log("successfully")
      console.log(waitLoading)
      console.log(transactionLoading)
    }
  });
  const [input, setInput] = useState('')
  const isError = input === ''

  return (
    <VStack justifyContent="center" alignItems="center" h="80vh">
      <FormControl isInvalid={isError} mt={6}>
          <Input
            className="input"
            placeholder='100ETH'
            maxLength={20}
            onChange={(e) =>
              {if (typeof e.target.value === 'number') {
                setAmount(parseInt(e.target.value))}
              }}
          />
      {!isError ? (
        <FormHelperText>
        </FormHelperText>
      ) : (
        <FormErrorMessage></FormErrorMessage>
      )}
        </FormControl>

      <Button className="button" mt={4} colorScheme='teal' onClick={() => sendTransaction()}>
        {'Send'}
      </Button>
    </VStack>
  );
}
