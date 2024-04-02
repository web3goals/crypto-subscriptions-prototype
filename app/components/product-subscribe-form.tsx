"use client";

import { siteConfig } from "@/config/site";
import { productAbi } from "@/contracts/abi/product";
import useError from "@/hooks/useError";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { erc20Abi, formatEther, parseEther } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

export function ProductSubscribeForm(props: {
  product: string;
  subscriptionCost: bigint;
  subscriptionToken: `0x${string}`;
  subscriptionTokenSymbol: string;
}) {
  const { handleError } = useError();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const formSchema = z.object({
    email: z.string().email(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsFormSubmitting(true);
      // Check clients
      if (!publicClient) {
        throw new Error("Public client is not ready");
      }
      if (!walletClient) {
        throw new Error("Wallet is not connected");
      }
      // Send request to approve transfers
      const approveAmount = parseEther("1000");
      const { request: approveRequest } = await publicClient.simulateContract({
        account: walletClient.account.address,
        address: props.subscriptionToken,
        abi: erc20Abi,
        functionName: "approve",
        args: [siteConfig.contracts.product, approveAmount],
      });
      const approveTxHash = await walletClient.writeContract(approveRequest);
      await publicClient.waitForTransactionReceipt({
        hash: approveTxHash,
      });
      // Subscribe
      const { request: subscribeRequest } = await publicClient.simulateContract(
        {
          account: walletClient.account.address,
          address: siteConfig.contracts.product,
          abi: productAbi,
          functionName: "subscribe",
          args: [BigInt(props.product), values.email],
        }
      );
      const subscribeTxHash = await walletClient.writeContract(
        subscribeRequest
      );
      await publicClient.waitForTransactionReceipt({
        hash: subscribeTxHash,
      });
      // Show success message
      toast({
        title: "Subscribed successfully 👌",
      });
      setIsFormSubmitting(false);
      setIsFormSubmitted(true);
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="alice@company.com"
                  disabled={isFormSubmitting || isFormSubmitted}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isFormSubmitting || isFormSubmitted}>
          {isFormSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Subscribe for {formatEther(props.subscriptionCost)}{" "}
          {props.subscriptionTokenSymbol}
        </Button>
      </form>
    </Form>
  );
}
