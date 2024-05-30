import { Typography } from '@material-tailwind/react';
import useImage from './use-image';

function PlantImage({ name }: { name: string }) {
  const { loading, image } = useImage(name);

  if (!image) return null;

  return <>{loading ? <Typography>loading</Typography> : <img className='w-4 h-4 mr-2' src={image} alt={name} />}</>;
}

export default PlantImage;
