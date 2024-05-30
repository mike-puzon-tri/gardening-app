import { Typography } from '@material-tailwind/react';
import PlantList from '@/features/plants/plant-list';
import InputPlant from '@/features/plants/input-plant';
import InputBed from '@/features/beds/input-bed';
import BedList, { GET_BEDS } from '@/features/beds/bed-list';
import { DndContext } from '@dnd-kit/core';
import { useMutation, gql } from '@apollo/client';


const ADD_PLANT_TO_BED = gql`
mutation AddPlantToBed($input: PlantBedInput) {
  addPlantToBed(input: $input) {
      id
    }
  }
`;

function Home() {
  const [addPlantToBed, { data, loading, error }] = useMutation(ADD_PLANT_TO_BED);

  const handleDragEnd = (event) => {
    const { over, active } = event;
    console.log(event);
    if (over && active) {
      console.log(active, over.data.current);
      const {bedId, x, y} = over.data.current;

      
      addPlantToBed({
        variables: {
          input: {
            plant: active.id,
            bedId,
            x,
            y
          }        
        },
        refetchQueries: [
          {
            query: GET_BEDS
          }
        ]
      });      
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Typography variant="lead" className="mb-2 !text-gray-500 md:pr-16 xl:pr-28">
        The open source garden bed tool
      </Typography>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <InputPlant />
            <PlantList />
          </div>
          <div>
            <InputBed />
            <BedList />
          </div>
        </div>
      </DndContext>
    </div>
  );
}

export const element = <Home />;

export default Home;
