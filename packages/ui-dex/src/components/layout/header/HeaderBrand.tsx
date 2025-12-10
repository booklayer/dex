import { Avatar, Link } from "@heroui/react";
import { ROUTES } from "@liberfi/core";
import { useTranslation } from "@liberfi/ui-base";

export function HeaderBrand() {
  const { t } = useTranslation();

  return (
    <Link href={ROUTES.tokenList.home()} aria-label={t("extend.header.home")}>
      <Avatar src="/brand_sm.png" className="w-10 h-10 bg-transparent rounded-none" />
    </Link>
  );
}
