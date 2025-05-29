import { siteConfig } from '@/config/site';
import Image from 'next/image';
import Link from 'next/link';
const Header = ({ headerData }: any) => {
  return (
    <>
      <div className="logo-content my-2 mx-2 flex items-center gap-2">
        <Link href="/admin" className='flex'>
          {headerData?.site_info?.site_logo ? (
            <Image
              src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${headerData?.site_info?.site_logo}`}
              width={60}
              height={60}
              alt=""
              className='sm:min-w-8 sm:min-h-8'
            />
          ) : (
            <Image
              src={`/assets/Image/SMEF-Logo.png`}
              width={60}
              height={60}
              alt=""
             className='sm:min-w-10 sm:min-h-10'
            />
          )}
          <p className='text-primary font-semibold sm:text-md lg:text-[28px] ml-3'>{headerData?.site_info?.site_title}</p>
        </Link>
      </div>

      <div className="logo-content my-2 mx-2 flex items-center gap-2">
        <Link href="/admin" className='flex'>
          {headerData?.site_info?.govt_logo ? (
            <Image
              src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${headerData?.site_info?.govt_logo}`}
              width={60}
              height={60}
              alt=""
              className='sm:min-w-10 sm:min-h-10'
            />
          ) : (
            <Image
              src={`/assets/Image/gov_logo.png`}
              width={60}
              height={60}
              alt=""
              className='sm:min-w-10 sm:min-h-10'
            />
          )}
        </Link>

      </div>
    </>
  )
}
export default Header