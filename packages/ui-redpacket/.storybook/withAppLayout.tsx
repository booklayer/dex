/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports */
import React, { PropsWithChildren, useMemo } from "react";
import { StoryFn } from "@storybook/react";
import { PinataSDK } from "pinata";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import Cookies from "js-cookie";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { DexClient } from "@chainstream-io/sdk";
import { IRouter, ITranslation, MockAppSdk } from "@liberfi/core";
import { GraphQLClientProvider } from "@liberfi/react-backend";
import { DexClientProvider } from "@liberfi/react-dex";
import {
  Page,
  PinataProvider,
  PrivyAuthProvider,
  PrivyWalletProvider,
  UIKitProvider,
  useDexTokenProvider,
} from "@liberfi/ui-base";
import en from "@liberfi/locales/dist/locales/en/translation.json";
import zh_CN from "@liberfi/locales/dist/locales/zh-CN/translation.json";
import { Header, BottomNavigationBar, DexDataProvider } from "@liberfi/ui-dex";
import AssetSelectModal from "@liberfi/ui-dex/dist/components/modals/AssetSelectModal";
import {
  ClaimRedPacketModal,
  RedPacketClaimsModal,
  RedPacketModal,
  ShareRedPacketModal,
} from "../src/components";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
      placeholderData: (prev: unknown) => prev,
    },
  },
});

// res:GraphQLClientResponse<unknown> | Error
const responseMiddleware = (res: any) => {
  const errors = res?.errors || res?.response?.errors || [];
  if (errors.length) {
    errors.forEach((error: any) => {
      console.error("graphql error:", error.message);
      if (error.extensions.code === "UNAUTHENTICATED") {
        if (typeof window !== "undefined") {
          // location.href = paths.auth
        }
      }
    });
  }
};

const graphqlClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!, {
  responseMiddleware,
});

const pinata = new PinataSDK({
  pinataGateway: process.env.PINATA_GATEWAY,
});

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: { translation: en },
      ["zh-CN"]: { translation: zh_CN },
    },
    lng: "en", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

export const translation = {
  t: i18n.t,
  i18n: {
    enable: true,
    reloadResources: i18n.reloadResources,
    changeLanguage: async (lng: string) => {
      await i18n.changeLanguage(lng);
    },
    language: i18n.language,
    languages: [...i18n.languages],
  },
} satisfies ITranslation;

const searchParams = new URLSearchParams();

export const router = {
  usePathname: () => "/",
  navigate: () => {},
  useSearchParams: () => searchParams,
} satisfies IRouter;

export const appSdk = new MockAppSdk();

function DexClientLoader({ children }: PropsWithChildren) {
  const dexTokenLoader = useMemo(
    () => ({
      async set(token: string, expiresAt: Date) {
        Cookies.set("dex-token", token, {
          expires: expiresAt,
          secure: true,
          sameSite: "strict",
        });
      },
      async get() {
        return Cookies.get("dex-token") ?? null;
      },
    }),
    [],
  );

  const dexTokenProvider = useDexTokenProvider(dexTokenLoader);

  const dexClient = useMemo(() => new DexClient(dexTokenProvider), [dexTokenProvider]);

  return <DexClientProvider client={dexClient}>{children}</DexClientProvider>;
}

export function withAppLayout(Story: StoryFn) {
  return (
    <QueryClientProvider client={queryClient}>
      <GraphQLClientProvider client={graphqlClient}>
        <DexClientLoader>
          <PinataProvider client={pinata}>
            <PrivyProvider
              appId={process.env.PRIVY_APPID!}
              config={{
                // Customize Privy's appearance in your app
                appearance: {
                  theme: "dark",
                  accentColor: "#BCFF2E",
                  logo: "https://liberfi.io/brand.png",
                  landingHeader: "Sign in or sign up to BookLayer",
                  walletList: [
                    "phantom",
                    "okx_wallet",
                    "solflare",
                    "backpack",
                    "detected_solana_wallets",
                  ],
                  walletChainType: "solana-only",
                },
                loginMethods: ["email", "google", "twitter", "discord", "github", "wallet"],
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
                <PrivyWalletProvider>
                  <UIKitProvider translation={translation} router={router} appSdk={appSdk}>
                    <DexDataProvider>
                      <Page bottomNavigationBar={<BottomNavigationBar />} header={<Header />}>
                        <Story />
                      </Page>
                      <AssetSelectModal />
                      <RedPacketModal />
                      <RedPacketClaimsModal />
                      <ClaimRedPacketModal />
                      <ShareRedPacketModal />
                    </DexDataProvider>
                  </UIKitProvider>
                </PrivyWalletProvider>
              </PrivyAuthProvider>
            </PrivyProvider>
          </PinataProvider>
        </DexClientLoader>
      </GraphQLClientProvider>
    </QueryClientProvider>
  );
}
