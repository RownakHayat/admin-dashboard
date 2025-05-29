import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";

const CatagoryEvent = ({ item, index }: any) => {
  console.log("item", item);

  return (
    <div>
      <Link href={`/admin/catagory-wise-single-event/${item?.id}`}>
        <div
          key={index}
          className="bg-white rounded-lg text-center mt-4 py-8 px-10"
        >
          <div className="flex justify-center">
            <Image
              priority={true}
              // src={`${"/assets/Image/catagory-image/"}${index + 1}${".png"}`}
              src={
                item?.banner
                  ? `${
                      siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL
                    }${item?.banner}`
                  : `${"/assets/Image/catagory-image/"}${index + 1}${".png"}`
              }
              alt=""
              width={70}
              height={70}
              className="flex items-center justify-center"
            />
          </div>
          <div className="mt-4 font-bold font-bangla">{item?.name_bn}</div>
        </div>
      </Link>
    </div>
  );
};

export default CatagoryEvent;
