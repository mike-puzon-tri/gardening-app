import { Typography } from '@material-tailwind/react';
import useImage from '../plants/use-image';

function BedPlant({ name }: { name: string }) {
  const { loading, image } = useImage(name);
  
  if (!image) return null;

  if (loading) return <Typography>loading</Typography>;

  return (
    <img
      className="mr-2 h-12 w-12"
      src={image}
      alt={name}  
    />
  );
}

export default BedPlant;
