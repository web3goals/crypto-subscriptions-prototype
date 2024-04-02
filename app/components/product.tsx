"use client";

import { siteConfig } from "@/config/site";
import { productAbi } from "@/contracts/abi/product";
import useMetadataLoader from "@/hooks/useMetadataLoader";
import { ProductMetadata } from "@/types/product-metadata";
import { erc20Abi, zeroAddress } from "viem";
import { useReadContract } from "wagmi";
import { ProductSubscribeForm } from "./product-subscribe-form";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

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
    <div className="flex flex-col items-start">
      <Avatar className="size-36">
        <AvatarImage src="" alt="Icon" />
        <AvatarFallback className="text-5xl bg-slate-500">
          {productMetadata?.icon}
        </AvatarFallback>
      </Avatar>
      <p className="text-4xl font-bold mt-8">{productMetadata?.label}</p>
      <p className="text-xl text-muted-foreground whitespace-pre-line mt- ">
        {productMetadata?.description}
      </p>
      <Separator className="my-8" />
      <ProductSubscribeForm
        product={props.product}
        subscriptionCost={productParams?.subscriptionCost || BigInt(0)}
        subscriptionToken={productParams?.subscriptionToken || zeroAddress}
        subscriptionTokenSymbol={productSubscriptionTokenSymbol || ""}
      />
    </div>
  );
}
