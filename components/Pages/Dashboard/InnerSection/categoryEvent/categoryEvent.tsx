import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";

const CategoryEvent = ({ serviceSMEUser, index }: any) => {

  return (
    <div>
      <Link href={`/admin/events/category-wise-event/${serviceSMEUser?.id}`}>
        <Card
          className={`${serviceSMEUser?.bgColor}flex items-center justify-center w-full sm:py-10 py-14 px-4 rounded-2xl border border-[#D3D4D5] min-h-[150px]`}
        >
          <CardContent className="flex items-center justify-center gap-3 p-0">
            <Image
              priority={true}
              // src={`${"/assets/Image/catagory-image/"}${index + 1}${".png"}`}

              src={`${siteConfig.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL
                }${serviceSMEUser?.banner}`}
              alt=""
              //   width="70"
              //   height="70"
              width={60}
              height={60}
              className="flex items-center justify-center"
            />

            <div>
              {/* <h2
                          className={`${serviceSMEUser.textColor} sm:text-[22px] md:text-[22px] lg:text-[25px]`}
                        >
                          {serviceSMEUser.count}
                        </h2> */}
              <h6 className="text-textColorSecond font-semibold sm:text-[20px] md:text-[20px] lg:text-[20px]">
                {serviceSMEUser?.name}
              </h6>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default CategoryEvent;
