import CityDetail,{cityMetadata} from '@/components/CityDetail';
export const metadata=cityMetadata('rotterdam');
export default function Page(){return <CityDetail slug="rotterdam"/>}
