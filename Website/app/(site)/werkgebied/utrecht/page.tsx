import CityDetail,{cityMetadata} from '@/components/CityDetail';
export const metadata=cityMetadata('utrecht');
export default function Page(){return <CityDetail slug="utrecht"/>}
