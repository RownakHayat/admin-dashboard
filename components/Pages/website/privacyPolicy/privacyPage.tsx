"use client";

import { useGetPrivacyDataQuery} from "@/store/features/home";
const PrivacyComponent = () => {

  const { data: listQuery, refetch, isLoading } = useGetPrivacyDataQuery();

  return (
    <div className="mt-5 mb-5 flex justify-center">
      <div
      className="max-w-2xl w-full"
        dangerouslySetInnerHTML={{ __html: listQuery?.data?.description }}
      />

    </div>
    
  );
};

export default PrivacyComponent;
