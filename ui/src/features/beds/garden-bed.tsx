import { Typography } from '@material-tailwind/react';

interface Props {
  width: number;
  height: number;
}

function GardenBed({ width, height }: Props) {
    const count = width * height;

  return (
    <div className={`grid border-4 border-black grid-cols-${width} grid-rows-${height} gap-0 w-fit mb-6`}>
      {[...Array(count)].map((x, i) => (
        <div key={i} className='h-16 w-16 border-2 border-slate-700 ' />
      ))}
    </div>
  );
}

export default GardenBed;
