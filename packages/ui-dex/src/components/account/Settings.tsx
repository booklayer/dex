import { Avatar, Button } from "@heroui/react";
import {
  DiscordIcon,
  FAQIcon,
  PrivacyPolicyIcon,
  SignInIcon,
  SignOutIcon,
  SupportIcon,
  TelegramIcon,
  TermsOfServiceIcon,
  TranslateIcon,
  TwitterIcon,
  useAppSdk,
  useAuth,
  useAuthenticatedCallback,
  UserGuideIcon,
  useTranslation,
} from "@liberfi/ui-base";
import { clsx } from "clsx";
import { ReactNode, useCallback } from "react";

export type SettingsProps = {
  onSetting?: (key: string) => void;
};

export function Settings({ onSetting }: SettingsProps) {
  const { t } = useTranslation();

  const appSdk = useAppSdk();

  const { signIn, signOut, status } = useAuth();

  const handleDeposit = useAuthenticatedCallback(() => {
    appSdk.events.emit("deposit:open");
    onSetting?.("deposit");
  }, [appSdk, onSetting]);

  const handleSwitchLanguage = useCallback(() => {
    appSdk.events.emit("language:open");
    onSetting?.("language");
  }, [appSdk, onSetting]);

  const handleOpenTwitter = useCallback(() => {
    // appSdk.openPage("https://x.com/booklayer");
    onSetting?.("twitter");
  }, [onSetting]);

  const handleOpenTelegram = useCallback(() => {
    // appSdk.openPage("https://t.me/booklayer");
    onSetting?.("telegram");
  }, [onSetting]);

  const handleOpenDiscord = useCallback(() => {
    // appSdk.openPage("https://discord.com/booklayer");
    onSetting?.("discord");
  }, [onSetting]);

  const handleOpenPrivacyPolicy = useCallback(() => {
    // appSdk.openPage("https://booklayer.org/privacy-policy");
    onSetting?.("privacy_policy");
  }, [onSetting]);

  const handleOpenTermsOfService = useCallback(() => {
    // appSdk.openPage("https://booklayer.org/terms-of-service");
    onSetting?.("terms_of_service");
  }, [onSetting]);

  const handleOpenSupport = useCallback(() => {
    // appSdk.openPage("https://booklayer.org/support");
    onSetting?.("support");
  }, [onSetting]);

  const handleOpenFAQ = useCallback(() => {
    // appSdk.openPage("https://booklayer.org/faq");
    onSetting?.("faq");
  }, [onSetting]);

  const handleOpenUserGuide = useCallback(() => {
    // appSdk.openPage("https://booklayer.org/docs");
    onSetting?.("user_guide");
  }, [onSetting]);

  const handleSignIn = useCallback(() => {
    signIn();
    onSetting?.("sign_in");
  }, [signIn, onSetting]);

  const handleSignOut = useCallback(() => {
    signOut();
    onSetting?.("sign_out");
  }, [signOut, onSetting]);

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* avatar & name */}
        <div className="flex items-center gap-6">
          <Avatar size="sm" src="/avatar.jpg" />
          <p className="text-base font-medium">{t("extend.settings.account_name")}</p>
        </div>
        {/* deposit */}
        <Button
          size="sm"
          className="text-sm font-medium bg-transparent text-primary"
          disableRipple
          onPress={handleDeposit}
        >
          {t("extend.settings.deposit")}
        </Button>
      </div>

      {/* setting options */}
      <div className="mt-8 space-y-8">
        {/* preferences */}
        <div className="space-y-6">
          <h2 className="text-sm font-medium text-neutral">{t("extend.settings.preferences")}</h2>
          <div className="grid grid-cols-4 gap-6 max-sm:grid-cols-3 max-sm:gap-4 content-center">
            <SettingsItem
              title={t("extend.settings.language")}
              icon={<TranslateIcon width={20} height={20} />}
              onPress={handleSwitchLanguage}
            />
          </div>
        </div>

        {/* social medias */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-neutral">{t("extend.settings.social_medias")}</h2>
          <div className="grid grid-cols-4 gap-6 max-sm:grid-cols-3 max-sm:gap-4 content-center">
            <SettingsItem
              title={t("extend.settings.twitter")}
              icon={<TwitterIcon width={20} height={20} />}
              onPress={handleOpenTwitter}
            />
            <SettingsItem
              title={t("extend.settings.telegram")}
              icon={<TelegramIcon width={20} height={20} />}
              onPress={handleOpenTelegram}
            />
            <SettingsItem
              title={t("extend.settings.discord")}
              icon={<DiscordIcon width={20} height={20} />}
              onPress={handleOpenDiscord}
            />
          </div>
        </div>

        {/* others */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-neutral">{t("extend.settings.others")}</h2>
          <div className="grid grid-cols-4 gap-6 max-sm:grid-cols-3 max-sm:gap-4 content-center">
            <SettingsItem
              title={t("extend.settings.privacy_policy")}
              icon={<PrivacyPolicyIcon width={20} height={20} />}
              onPress={handleOpenPrivacyPolicy}
            />
            <SettingsItem
              title={t("extend.settings.terms_of_service")}
              icon={<TermsOfServiceIcon width={20} height={20} />}
              onPress={handleOpenTermsOfService}
            />
            <SettingsItem
              title={t("extend.settings.support")}
              icon={<SupportIcon width={20} height={20} />}
              onPress={handleOpenSupport}
            />
            <SettingsItem
              title={t("extend.settings.faq")}
              icon={<FAQIcon width={20} height={20} />}
              onPress={handleOpenFAQ}
            />
            <SettingsItem
              title={t("extend.settings.user_guide")}
              icon={<UserGuideIcon width={20} height={20} />}
              onPress={handleOpenUserGuide}
            />
            {status === "authenticated" && (
              <SettingsItem
                title={t("extend.auth.signout")}
                icon={<SignOutIcon width={20} height={20} />}
                onPress={handleSignOut}
                className="text-danger-500"
              />
            )}
            {status === "unauthenticated" && (
              <SettingsItem
                title={t("extend.auth.signin")}
                icon={<SignInIcon width={20} height={20} />}
                onPress={handleSignIn}
                className="text-primary"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type SettingsItemProps = {
  title: string;
  icon: ReactNode;
  className?: string;
  onPress: () => void;
};

function SettingsItem({ title, icon, className, onPress }: SettingsItemProps) {
  return (
    <div>
      <Button
        size="sm"
        radius="none"
        className={clsx(
          "w-full h-full min-w-0 min-h-0 p-0 flex-col bg-transparent overflow-hidden max-sm:text-xxs",
          className,
        )}
        disableRipple
        onPress={onPress}
        startContent={icon}
      >
        <span className="w-full text-ellipsis overflow-hidden">{title}</span>
      </Button>
    </div>
  );
}
