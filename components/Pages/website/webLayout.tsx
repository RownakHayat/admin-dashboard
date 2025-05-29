"use client";

import Footer from '@/components/home/footer/footer';
import { useGetHomeDataQuery } from '@/store/features/home';
import WebHeader from './webHeader';

const WebLayout = ({ children }: any) => {
  const { data: listQuery, refetch, isLoading } = useGetHomeDataQuery();

  return (
    <>
      <WebHeader />
      {children}
      <Footer footerData={listQuery?.data?.site_info} />
    </>
  );
};

export default WebLayout;
