import BedSquare from './bed-square';
import { useMemo } from 'react';

interface Props {
  width: number;
  height: number;
  bedId: number;
  plants: {
    plant: string;
    x: number;
    y: number;
  }[];
}

function GardenBed({ width, height, bedId, plants }: Props) {
  const count = width * height;

  const bedItems = useMemo(() => {
    const squares = [];
    for (let index = 0; index < count; index++) {
      const x = (index % width) + 1;
      const y = Math.floor(index / width) + 1;

      // check if square has a plant
      const found = plants.find((plant) => plant.x === x && plant.y === y);
      const plant = found ? found.plant : ''
      squares.push({x, y, plant, index})
    }

    return squares;
  }, [width, height, bedId, plants])

  return (
    <div className={`grid border-4 border-black grid-cols-${width} grid-rows-${height} mb-6 w-fit gap-0`}>
      {bedItems.map((bedItem) => (
        <BedSquare key={bedItem.index} bedId={bedId} {...bedItem} />
      ))}      
    </div>
  );
}

export default GardenBed;
