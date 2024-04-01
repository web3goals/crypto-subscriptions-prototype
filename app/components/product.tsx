"use client";

import { siteConfig } from "@/config/site";
import { productAbi } from "@/contracts/abi/product";
import useMetadataLoader from "@/hooks/useMetadataLoader";
import { ProductMetadata } from "@/types/product-metadata";
import { useReadContract } from "wagmi";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { erc20Abi, formatEther, zeroAddress } from "viem";

export function Product(props: { product: string }) {
  /**
   * Define product data
   */
  const { data: productParams, isFetched: isProductParamsFetched } =
    useReadContract({
      address: siteConfig.contracts.product,
      abi: productAbi,
      functionName: "getParams",
      args: [BigInt(props.product)],
    });
  const { data: productMetadataUri, isFetched: isProductMetadataUriFetched } =
    useReadContract({
      address: siteConfig.contracts.product,
      abi: productAbi,
      functionName: "tokenURI",
      args: [BigInt(props.product)],
    });
  const { data: productMetadata, isLoaded: isProductMetadataLoaded } =
    useMetadataLoader<ProductMetadata>(productMetadataUri);

  /**
   * Define product subscription token symbol
   */
  const {
    data: productSubscriptionTokenSymbol,
    isFetched: isProductSubscriptionTokenSymbol,
  } = useReadContract({
    address: productParams?.subscriptionToken || zeroAddress,
    abi: erc20Abi,
    functionName: "symbol",
  });

  if (
    !isProductParamsFetched ||
    !isProductMetadataUriFetched ||
    !isProductMetadataLoaded ||
    !isProductSubscriptionTokenSymbol
  ) {
    return <Skeleton className="w-full h-8" />;
  }

  return (
    <div className="flex flex-col items-center">
      <Avatar className="size-32">
        <AvatarImage src="" alt="Icon" />
        <AvatarFallback className="text-5xl bg-slate-500">
          {productMetadata?.icon}
        </AvatarFallback>
      </Avatar>
      <p className="text-2xl font-bold mt-4">{productMetadata?.label}</p>
      <p className="text-nowrap text-muted-foreground mt-1">
        {productMetadata?.description}
      </p>
      {/* TODO: Implement button using contract request */}
      <Button className="mt-8">
        Subscribe for{" "}
        {formatEther(productParams?.subscriptionCost || BigInt(0))}{" "}
        {productSubscriptionTokenSymbol}
      </Button>
    </div>
  );
}
