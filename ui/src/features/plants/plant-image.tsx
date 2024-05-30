import { Typography } from '@material-tailwind/react';
import { useDraggable } from '@dnd-kit/core';
import useImage from './use-image';

function PlantImage({ name }: { name: string }) {
  const { loading, image } = useImage(name);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: name
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }
    : undefined;

  if (!image) return null;

  if (loading) return <Typography>loading</Typography>;

  return (
    <img
      className="mr-2 h-12 w-12"
      src={image}
      alt={name}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    />
  );
}

export default PlantImage;
