import CityDetail,{cityMetadata} from '@/components/CityDetail';
export const metadata=cityMetadata('amsterdam');
export default function Page(){return <CityDetail slug="amsterdam"/>}
