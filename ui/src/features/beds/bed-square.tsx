import { useDroppable } from '@dnd-kit/core';
import BedPlant from './bed-plant';

interface Props {
    index: number;
    bedId: number;
    x: number;
    y: number;
    plant: string;
}

function BedSquare({ index, bedId, x, y, plant }: Props) {  
  const { isOver, setNodeRef } = useDroppable({
    id: `${bedId}-${index}`,
    data: {
        bedId,
        x,
        y,
    }
  });
  const style = {
    color: isOver ? 'green' : undefined
  };

  return (
    <div
      className={`h-16 w-16 border-2 flex justify-center items-center ${isOver ? 'border-green-600' : 'border-slate-700'}  `}
      ref={setNodeRef}
      style={style}
    >
        {plant && <BedPlant name={plant} />}
    </div>
  );
}

export default BedSquare;