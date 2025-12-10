"use client";

import { PropsWithChildren } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { PrivyAuthProvider, PrivyWalletProvider } from "@liberfi/ui-base";

export function AuthProviders({ children }: PropsWithChildren) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APPID}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "dark",
          accentColor: "#BCFF2E",
          logo: "/brand_sm.png",
          landingHeader: "Sign in or sign up to BookLayer",
          walletList: ["phantom", "okx_wallet", "solflare", "backpack", "detected_solana_wallets"],
          walletChainType: "solana-only",
        },
        loginMethods: [/*"email", "google", "twitter", "discord", "github", */"wallet"],
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors({
              shouldAutoConnect: true,
            }),
          },
        },
      }}
    >
      <PrivyAuthProvider>
        <PrivyWalletProvider>{children}</PrivyWalletProvider>
      </PrivyAuthProvider>
    </PrivyProvider>
  );
}
