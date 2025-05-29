"use client";

import { useToken } from "@/components/common/hooks/tokenChecker";
import WebLayout from "@/components/Pages/website/webLayout";
import Website from "@/components/Pages/website/Website";
import HomeWebLayout from "@/components/Pages/HomePage/webLayout";
import HomeWebsites from "@/components/Pages/HomePage/Website";

export default function Home() {
  const hasToken = useToken();
  return (
    <div>
      {hasToken ? (
        <HomeWebLayout>
          <HomeWebsites />
        </HomeWebLayout>
      ) : (
        <WebLayout>
          <Website />
        </WebLayout>
      )}
    </div>
  );
}
