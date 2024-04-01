"use client";

import { siteConfig } from "@/config/site";
import { productAbi } from "@/contracts/abi/product";
import useError from "@/hooks/useError";
import useMetadataLoader from "@/hooks/useMetadataLoader";
import { addressToShortAddress } from "@/lib/converters";
import { ProductMetadata } from "@/types/product-metadata";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatEther, zeroAddress } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { useAccount, useReadContract } from "wagmi";
import EntityList from "./entity-list";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export function ProductList() {
  const { handleError } = useError();
  const { address } = useAccount();
  const [products, setProducts] = useState<string[] | undefined>();

  async function loadProducts() {
    try {
      if (!address) {
        return;
      }
      if (siteConfig.contracts.chain.id !== arbitrumSepolia.id) {
        return;
      }
      const { data } = await axios.get(
        `https://arb-sepolia.g.alchemy.com/nft/v3/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTsForOwner?owner=${address}&contractAddresses[]=${siteConfig.contracts.product}&withMetadata=false&pageSize=100`
      );
      if (data) {
        console.log(data);
        setProducts(data.ownedNfts?.map((nft: any) => nft.tokenId));
      }
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <EntityList
      entities={products}
      renderEntityCard={(product, index) => (
        <ProductCard key={index} product={product} />
      )}
      noEntitiesText="No products 😐"
    />
  );
}

export function ProductCard(props: { product: string }) {
  return (
    <div className="w-full flex flex-col items-center border rounded px-4 py-4">
      <ProductCardHeader product={props.product} />
      <Separator className="my-4" />
      <ProductCardSubscribers product={props.product} />
    </div>
  );
}

function ProductCardHeader(props: { product: string }) {
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

  function OpenPageButton() {
    return (
      <a href={`/products/${props.product}`} target="_blank">
        <Button>Open Product Page</Button>
      </a>
    );
  }

  // TODO: Implement button using smart contract request
  function WithdrawButton() {
    return <Button variant="outline">Withdraw Balance</Button>;
  }

  if (
    !isProductParamsFetched ||
    !isProductMetadataUriFetched ||
    !isProductMetadataLoaded
  ) {
    return <Skeleton className="w-full h-8" />;
  }

  return (
    <div className="w-full flex flex-row gap-4">
      {/* Icon */}
      <div>
        <Avatar className="size-16">
          <AvatarImage src="" alt="Icon" />
          <AvatarFallback className="text-3xl bg-slate-500">
            {productMetadata?.icon}
          </AvatarFallback>
        </Avatar>
      </div>
      {/* Content */}
      <div className="w-full">
        <p className="text-xl font-bold">{productMetadata?.label}</p>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[140px] text-sm text-muted-foreground">
              Subscription cost:
            </p>
            <p className="text-sm break-all">
              {formatEther(productParams?.subscriptionCost || BigInt(0))}{" "}
              {siteConfig.contracts.chain.nativeCurrency.symbol}
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[140px] text-sm text-muted-foreground">
              Subscription period:
            </p>
            <p className="text-sm break-all">
              {productParams?.subscriptionPeriod?.toString()} seconds
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[140px] text-sm text-muted-foreground">
              Subscription token:
            </p>
            <p className="text-sm break-all">
              <a
                href={`${siteConfig.contracts.chain.blockExplorers.default.url}/address/${productParams?.subscriptionToken}`}
                target="_blank"
              >
                {addressToShortAddress(
                  productParams?.subscriptionToken || zeroAddress
                )}
              </a>
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[140px] text-sm text-muted-foreground">
              Balance:
            </p>
            <p className="text-sm break-all">
              {formatEther(productParams?.balance || BigInt(0))}{" "}
              {siteConfig.contracts.chain.nativeCurrency.symbol}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-6 md:flex-row">
          <OpenPageButton />
          <WithdrawButton />
        </div>
      </div>
    </div>
  );
}

// TODO: Load subscribers using Tableland
function ProductCardSubscribers(props: { product: string }) {
  return (
    <div className="w-full flex flex-row gap-4">
      {/* Icon */}
      <div>
        <Avatar className="size-12">
          <AvatarImage src="" alt="Icon" />
          <AvatarFallback className="text-base">💙</AvatarFallback>
        </Avatar>
      </div>
      {/* Content */}
      <div className="w-full">
        <p className="text-base font-bold">Subscribers</p>
        <Skeleton className="w-full h-8 mt-4" />
      </div>
    </div>
  );
}
